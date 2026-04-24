/**
 * The work loop drives the rendering pipeline:
 * 1. Begin work: traverse fibers, render components, reconcile children
 * 2. Complete work: build DOM nodes bottom-up
 * 3. Commit: apply mutations to the real DOM, run effects
 */

import {
  type Fiber,
  type Props,
  type LiquidNode,
  type FunctionComponent,
  type ClassComponentInstance,
  FiberTag,
  EffectTag,
  LIQUID_STRICT_MODE_TYPE,
} from '../shared/types';
import { createHostRootFiber, createWorkInProgress } from '../core/fiber';
import { reconcileChildren } from '../core/reconciler';
import {
  setCurrentFiber,
  getEffectList,
  type EffectHook,
  EffectHookTag,
} from '../hooks/hook-state';
import { installDispatcher, uninstallDispatcher } from '../hooks/install-dispatcher';
import { setRerenderCallback } from '../hooks/dispatcher';
import { scheduleMicrotask } from '../core/scheduler';
import { notifyDevToolsOfCommit } from '../devtools/index';
import {
  NoLanes,
  SyncLane,
  DefaultLane,
  includesSomeLane,
  getHighestPriorityLane,
  mergeLanes,
  removeLanes,
} from '../core/lanes';
import {
  shouldYieldToHost,
  resetDeadline,
  scheduleCallback,
  cancelCallback,
  type CallbackNode,
  type SchedulerCallback,
} from '../core/scheduler-host-config';

// ---------------------------------------------------------------------------
// Root container state
// ---------------------------------------------------------------------------

export interface FiberRoot {
  containerNode: Element | DocumentFragment;
  current: Fiber;
  pendingChildren: LiquidNode;
  callbackScheduled: boolean;

  // Lane-based concurrent scheduling
  pendingLanes: number;
  suspendedLanes: number;
  expirationTimes: number[];
  callbackNode: unknown;
  callbackPriority: number;

  // Hydration
  isHydrating: boolean;
}

const fiberRoots = new Map<Element | DocumentFragment, FiberRoot>();

export function createFiberRoot(container: Element | DocumentFragment): FiberRoot {
  const rootFiber = createHostRootFiber();
  rootFiber.stateNode = container;

  const root: FiberRoot = {
    containerNode: container,
    current: rootFiber,
    pendingChildren: null,
    callbackScheduled: false,

    // Lane-based concurrent scheduling (initialized to idle)
    pendingLanes: 0,
    suspendedLanes: 0,
    expirationTimes: new Array(8).fill(-1),
    callbackNode: null,
    callbackPriority: 0,

    // Hydration
    isHydrating: false,
  };

  return root;
}

// ---------------------------------------------------------------------------
// Schedule and perform work
// ---------------------------------------------------------------------------

export function scheduleRender(root: FiberRoot, children: LiquidNode): void {
  root.pendingChildren = children;

  if (!root.callbackScheduled) {
    root.callbackScheduled = true;
    scheduleMicrotask(() => {
      root.callbackScheduled = false;
      performWork(root);
    });
  }
}

export function performSyncWork(root: FiberRoot, children: LiquidNode): void {
  root.pendingChildren = children;
  performWork(root);
}

// Install a persistent re-render callback that routes state updates
// back through scheduleRender for async batching.
function installPersistentRerenderCallback(): void {
  setRerenderCallback((fiber: Fiber) => {
    // Walk up to the root fiber
    let node: Fiber | null = fiber;
    while (node?.return) {
      node = node.return;
    }
    if (node && node.stateNode) {
      const fRoot = findRootForContainer(node.stateNode as Element);
      if (fRoot) {
        scheduleRender(fRoot, fRoot.pendingChildren);
      }
    }
  });
}

function performWork(root: FiberRoot): void {
  // Ensure re-render callback is active
  installPersistentRerenderCallback();

  // Set up hydration context if this root is hydrating
  if (root.isHydrating) {
    activeHydrationRoot = root;
    hydrationCursor.clear();
  }

  const currentRoot = root.current;
  const wip = createWorkInProgress(currentRoot, {
    children: root.pendingChildren,
  } as Props);

  // Begin phase: walk the tree top-down (synchronous)
  workLoopSync(wip);

  // Commit phase: apply changes to DOM
  commitRoot(root, wip);

  // Swap the trees
  root.current = wip;

  // Clear hydration state
  if (root.isHydrating) {
    root.isHydrating = false;
    activeHydrationRoot = null;
    hydrationCursor.clear();
  }
}

// ---------------------------------------------------------------------------
// Synchronous vs. concurrent work loops
// ---------------------------------------------------------------------------

/** Synchronous work loop — processes entire tree without yielding. */
function workLoopSync(startFiber: Fiber): void {
  let unitOfWork: Fiber | null = startFiber;
  while (unitOfWork !== null) {
    unitOfWork = performUnitOfWork(unitOfWork);
  }
}

/** Concurrent work loop — yields to the host after each frame budget. */
function workLoopConcurrent(startFiber: Fiber): Fiber | null {
  let unitOfWork: Fiber | null = startFiber;
  while (unitOfWork !== null && !shouldYieldToHost()) {
    unitOfWork = performUnitOfWork(unitOfWork);
  }
  return unitOfWork; // null = complete, non-null = interrupted
}

// ---------------------------------------------------------------------------
// Concurrent rendering entry point
// ---------------------------------------------------------------------------

// Module-level state for interruptible rendering
let wipRoot: FiberRoot | null = null;
let wipFiber: Fiber | null = null;

/**
 * Mark a root as having pending work at the given lane.
 */
export function markRootUpdated(root: FiberRoot, lane: number): void {
  root.pendingLanes = mergeLanes(root.pendingLanes, lane);
}

/**
 * Get the next lanes that should be worked on for a root.
 * Returns the highest-priority pending lane(s).
 */
function getNextLanes(root: FiberRoot): number {
  const pendingLanes = root.pendingLanes;
  if (pendingLanes === NoLanes) return NoLanes;
  return getHighestPriorityLane(pendingLanes);
}

/**
 * Ensure that work is scheduled for a root. This is the central coordinator
 * that decides whether to use sync or concurrent rendering based on lanes.
 */
export function ensureRootIsScheduled(root: FiberRoot): void {
  const nextLanes = getNextLanes(root);

  if (nextLanes === NoLanes) {
    // No work to do — cancel any existing callback
    if (root.callbackNode !== null) {
      cancelCallback(root.callbackNode as CallbackNode);
      root.callbackNode = null;
      root.callbackPriority = NoLanes;
    }
    return;
  }

  const highestPriority = getHighestPriorityLane(nextLanes);

  // If there's already a callback at this priority, don't schedule another
  if (root.callbackPriority === highestPriority && root.callbackNode !== null) {
    return;
  }

  // Cancel any existing lower-priority callback
  if (root.callbackNode !== null) {
    cancelCallback(root.callbackNode as CallbackNode);
  }

  // SyncLane and DefaultLane use synchronous rendering
  if (includesSomeLane(highestPriority, SyncLane | DefaultLane)) {
    // Schedule via microtask for batching (existing behavior)
    root.callbackNode = null;
    root.callbackPriority = highestPriority;

    if (!root.callbackScheduled) {
      root.callbackScheduled = true;
      scheduleMicrotask(() => {
        root.callbackScheduled = false;
        performSyncWorkOnRoot(root);
      });
    }
  } else {
    // Concurrent rendering for transition/idle lanes
    const callbackNode = scheduleCallback(() => {
      return performConcurrentWorkOnRoot(root);
    });
    root.callbackNode = callbackNode;
    root.callbackPriority = highestPriority;
  }
}

/**
 * Synchronous render for SyncLane and DefaultLane work.
 */
function performSyncWorkOnRoot(root: FiberRoot): void {
  const lanes = getNextLanes(root);
  if (lanes === NoLanes) return;

  installPersistentRerenderCallback();

  const currentRoot = root.current;
  const wip = createWorkInProgress(currentRoot, {
    children: root.pendingChildren,
  } as Props);

  wipRoot = root;
  wipFiber = wip;

  workLoopSync(wip);

  // Commit
  commitRoot(root, wip);
  root.current = wip;

  // Clear completed lanes
  root.pendingLanes = removeLanes(root.pendingLanes, lanes);
  root.callbackNode = null;
  root.callbackPriority = NoLanes;
  wipRoot = null;
  wipFiber = null;

  // Check if there's more work at a different priority
  ensureRootIsScheduled(root);
}

/**
 * Concurrent render for transition/idle lanes.
 * Returns a continuation function if work was interrupted,
 * or null if work is complete.
 */
function performConcurrentWorkOnRoot(root: FiberRoot): SchedulerCallback | null {
  const lanes = getNextLanes(root);
  if (lanes === NoLanes) return null;

  installPersistentRerenderCallback();

  // If we don't have a WIP tree for this root, create one
  if (wipRoot !== root || wipFiber === null) {
    const currentRoot = root.current;
    wipFiber = createWorkInProgress(currentRoot, {
      children: root.pendingChildren,
    } as Props);
    wipRoot = root;
    }

  resetDeadline();
  const remaining = workLoopConcurrent(wipFiber);

  if (remaining !== null) {
    // Work was interrupted — save position and return continuation
    wipFiber = remaining;
    return () => performConcurrentWorkOnRoot(root);
  }

  // Work is complete — commit
  const finishedWork = wipFiber!;
  commitRoot(root, finishedWork);
  root.current = finishedWork;

  // Clear completed lanes
  root.pendingLanes = removeLanes(root.pendingLanes, lanes);
  root.callbackNode = null;
  root.callbackPriority = NoLanes;
  wipRoot = null;
  wipFiber = null;

  // Check for remaining work
  ensureRootIsScheduled(root);

  return null;
}

function findRootForContainer(container: unknown): FiberRoot | null {
  for (const [, root] of fiberRoots) {
    if (root.containerNode === container) {
      return root;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Work phase
// ---------------------------------------------------------------------------

function performUnitOfWork(fiber: Fiber): Fiber | null {
  beginWork(fiber);

  // Depth-first: go to child
  if (fiber.child !== null) {
    return fiber.child;
  }

  // No child: complete this fiber and try sibling
  let current: Fiber | null = fiber;
  while (current !== null) {
    completeWork(current);

    if (current.sibling !== null) {
      return current.sibling;
    }
    current = current.return;
  }

  return null;
}

function beginWork(fiber: Fiber): void {
  // During hydration, claim existing DOM nodes top-down
  if (activeHydrationRoot !== null && fiber.stateNode === null) {
    if (fiber.tag === FiberTag.HostComponent || fiber.tag === FiberTag.HostText) {
      const parentNode = findHostParentForHydration(fiber, activeHydrationRoot.containerNode);
      if (parentNode) {
        if (fiber.tag === FiberTag.HostComponent) {
          const existing = tryHydrateInstance(fiber, parentNode);
          if (existing) {
            fiber.stateNode = existing;
          }
        } else {
          const existing = tryHydrateText(parentNode);
          if (existing) {
            fiber.stateNode = existing;
          }
        }
      }
    }
  }

  switch (fiber.tag) {
    case FiberTag.HostRoot:
      reconcileHostRoot(fiber);
      break;
    case FiberTag.HostComponent:
      reconcileHostComponent(fiber);
      break;
    case FiberTag.HostText:
      // Text nodes have no children
      break;
    case FiberTag.FunctionComponent:
      reconcileFunctionComponent(fiber);
      break;
    case FiberTag.ClassComponent:
      reconcileClassComponent(fiber);
      break;
    case FiberTag.Fragment:
      // Track StrictMode depth
      if (fiber.type === LIQUID_STRICT_MODE_TYPE) {
        strictModeDepth++;
      }
      reconcileFragment(fiber);
      break;
    case FiberTag.ContextProvider:
      reconcileContextProvider(fiber);
      break;
    case FiberTag.ForwardRef:
      reconcileForwardRef(fiber);
      break;
    case FiberTag.MemoComponent:
      reconcileMemoComponent(fiber);
      break;
    default:
      reconcileFragment(fiber);
      break;
  }
}

function reconcileHostRoot(fiber: Fiber): void {
  const children = fiber.pendingProps.children;
  fiber.child = reconcileChildren(fiber, fiber.alternate?.child ?? null, children, 0);
}

function reconcileHostComponent(fiber: Fiber): void {
  const children = fiber.pendingProps.children;
  fiber.child = reconcileChildren(fiber, fiber.alternate?.child ?? null, children, 0);
}

function reconcileFunctionComponent(fiber: Fiber): void {
  // Install hooks dispatcher and set fiber context
  installDispatcher();
  setCurrentFiber(fiber);

  const Component = fiber.type as FunctionComponent;

  // StrictMode double-render: call component twice to detect side effects.
  // The first invocation's result is discarded.
  if (strictModeDepth > 0 && fiber.alternate === null) {
    Component(fiber.pendingProps);
    // Reset hook state for the real render
    setCurrentFiber(fiber);
  }

  const children = Component(fiber.pendingProps);

  // Store effect list on fiber
  const effects = getEffectList();
  fiber.dependencies = effects;

  setCurrentFiber(null);
  uninstallDispatcher();

  fiber.child = reconcileChildren(fiber, fiber.alternate?.child ?? null, children, 0);
}

function reconcileClassComponent(fiber: Fiber): void {
  const Constructor = fiber.type as new (props: Props) => ClassComponentInstance;
  let instance: ClassComponentInstance;

  if (fiber.stateNode === null) {
    // Mount
    instance = new Constructor(fiber.pendingProps);
    fiber.stateNode = instance;
  } else {
    // Update
    instance = fiber.stateNode as ClassComponentInstance;
    instance.props = fiber.pendingProps;
  }

  const children = instance.render();
  fiber.child = reconcileChildren(fiber, fiber.alternate?.child ?? null, children, 0);
}

function reconcileFragment(fiber: Fiber): void {
  const children = fiber.pendingProps.children;
  fiber.child = reconcileChildren(fiber, fiber.alternate?.child ?? null, children, 0);
}

function reconcileContextProvider(fiber: Fiber): void {
  const provider = fiber.type as unknown as { _context: { _currentValue: unknown } };
  const value = fiber.pendingProps.value;

  if (provider._context) {
    provider._context._currentValue = value;
  }

  const children = fiber.pendingProps.children;
  fiber.child = reconcileChildren(fiber, fiber.alternate?.child ?? null, children, 0);
}

function reconcileForwardRef(fiber: Fiber): void {
  const { render } = fiber.type as unknown as {
    render: (props: Props, ref: unknown) => LiquidNode;
  };

  installDispatcher();
  setCurrentFiber(fiber);

  const children = render(fiber.pendingProps, fiber.ref);

  const effects = getEffectList();
  fiber.dependencies = effects;

  setCurrentFiber(null);
  uninstallDispatcher();

  fiber.child = reconcileChildren(fiber, fiber.alternate?.child ?? null, children, 0);
}

function reconcileMemoComponent(fiber: Fiber): void {
  const { type: innerType, compare } = fiber.type as unknown as {
    type: FunctionComponent;
    compare: ((prev: Props, next: Props) => boolean) | null;
  };

  // Check if we can bail out
  if (fiber.alternate !== null) {
    const prevProps = fiber.alternate.memoizedProps;
    const nextProps = fiber.pendingProps;

    if (prevProps !== null) {
      const shouldSkip = compare
        ? compare(prevProps, nextProps)
        : shallowPropsEqual(prevProps, nextProps);

      if (shouldSkip) {
        // Bail out — clone the child subtree from alternate
        fiber.child = cloneFiberSubtree(fiber.alternate.child, fiber);
        return;
      }
    }
  }

  // Render the inner component
  installDispatcher();
  setCurrentFiber(fiber);

  const children = innerType(fiber.pendingProps);

  const effects = getEffectList();
  fiber.dependencies = effects;

  setCurrentFiber(null);
  uninstallDispatcher();

  fiber.child = reconcileChildren(fiber, fiber.alternate?.child ?? null, children, 0);
}

function shallowPropsEqual(a: Props, b: Props): boolean {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (key === 'children') continue; // skip children comparison
    if (!Object.is(a[key], b[key])) return false;
  }
  return true;
}

/**
 * Clone a fiber subtree for bail-out, preserving stateNodes
 * and setting up alternate links so future reconciliation works.
 */
function cloneFiberSubtree(source: Fiber | null, parent: Fiber): Fiber | null {
  if (source === null) return null;

  const clone: Fiber = {
    ...source,
    return: parent,
    alternate: source,
    child: null,
    sibling: null,
    effectTag: EffectTag.NoEffect,
    pendingProps: source.memoizedProps ?? source.pendingProps,
  };
  source.alternate = clone;

  clone.child = cloneFiberSubtree(source.child, clone);

  let sourceChild = source.child?.sibling ?? null;
  let prevClonedChild = clone.child;
  while (sourceChild !== null) {
    const clonedSibling: Fiber = {
      ...sourceChild,
      return: parent,
      alternate: sourceChild,
      child: null,
      sibling: null,
      effectTag: EffectTag.NoEffect,
      pendingProps: sourceChild.memoizedProps ?? sourceChild.pendingProps,
    };
    sourceChild.alternate = clonedSibling;

    clonedSibling.child = cloneFiberSubtree(sourceChild.child, clonedSibling);

    if (prevClonedChild) {
      prevClonedChild.sibling = clonedSibling;
    }
    prevClonedChild = clonedSibling;
    sourceChild = sourceChild.sibling;
  }

  return clone;
}

// ---------------------------------------------------------------------------
// Hydration helpers
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// SVG namespace handling
// ---------------------------------------------------------------------------

const SVG_TAGS = new Set([
  'svg', 'circle', 'clipPath', 'defs', 'ellipse', 'g', 'line',
  'linearGradient', 'mask', 'path', 'pattern', 'polygon', 'polyline',
  'radialGradient', 'rect', 'stop', 'text', 'tspan', 'use', 'image',
  'symbol', 'foreignObject', 'desc', 'title', 'metadata', 'marker',
  'filter', 'feBlend', 'feColorMatrix', 'feComponentTransfer',
  'feComposite', 'feConvolveMatrix', 'feDiffuseLighting',
  'feDisplacementMap', 'feFlood', 'feGaussianBlur', 'feImage',
  'feMerge', 'feMergeNode', 'feMorphology', 'feOffset',
  'feSpecularLighting', 'feTile', 'feTurbulence',
  'animate', 'animateMotion', 'animateTransform', 'set',
]);

function isSvgTag(tag: string): boolean {
  return SVG_TAGS.has(tag);
}

/**
 * Check if a DOM element is a custom element (Web Component).
 * Custom elements must contain a hyphen in their tag name per the spec.
 */
function isCustomElement(dom: Element): boolean {
  return dom.tagName.includes('-');
}

// ---------------------------------------------------------------------------
// StrictMode double-render tracking
// ---------------------------------------------------------------------------

let strictModeDepth = 0;

// Active hydration root — set during hydration render, null otherwise
let activeHydrationRoot: FiberRoot | null = null;
// Hydration cursor — tracks position in existing DOM during hydration
let hydrationCursor = new Map<Node, Node | null>();

/**
 * Get the next hydratable child or sibling from a parent DOM node.
 * Skips comment nodes and other non-hydratable nodes.
 */
function getNextHydratableChild(parent: Node): Node | null {
  let child = parent.firstChild;
  while (child !== null) {
    if (child.nodeType === 1 /* Element */ || child.nodeType === 3 /* Text */) {
      return child;
    }
    child = child.nextSibling;
  }
  return null;
}

function getNextHydratableSibling(node: Node): Node | null {
  let sibling = node.nextSibling;
  while (sibling !== null) {
    if (sibling.nodeType === 1 || sibling.nodeType === 3) {
      return sibling;
    }
    sibling = sibling.nextSibling;
  }
  return null;
}

/**
 * Try to hydrate a HostComponent fiber by matching it to an existing DOM element.
 * Returns the matched DOM element or null if no match.
 */
function tryHydrateInstance(
  fiber: Fiber,
  parentNode: Node,
): HTMLElement | null {
  // Get the next unmatched child from the cursor, or the first child
  let candidate = hydrationCursor.get(parentNode) ?? getNextHydratableChild(parentNode);

  if (candidate === null) return null;

  // Skip text nodes when looking for elements
  while (candidate !== null && candidate.nodeType !== 1) {
    candidate = getNextHydratableSibling(candidate);
  }

  if (candidate === null) return null;

  const element = candidate as HTMLElement;
  if (element.tagName.toLowerCase() !== (fiber.type as string).toLowerCase()) {
    // Tag mismatch — cannot hydrate
    return null;
  }

  // Advance cursor past this node
  hydrationCursor.set(parentNode, getNextHydratableSibling(element));
  return element;
}

/**
 * Try to hydrate a HostText fiber by matching it to an existing text node.
 */
function tryHydrateText(parentNode: Node): Text | null {
  let candidate = hydrationCursor.get(parentNode) ?? getNextHydratableChild(parentNode);

  if (candidate === null) return null;

  // Skip elements when looking for text
  while (candidate !== null && candidate.nodeType !== 3) {
    candidate = getNextHydratableSibling(candidate);
  }

  if (candidate === null) return null;

  const textNode = candidate as Text;
  hydrationCursor.set(parentNode, getNextHydratableSibling(textNode));
  return textNode;
}

/**
 * Find the host parent DOM node for a fiber (walk up past non-host fibers).
 */
function findHostParentForHydration(fiber: Fiber, rootContainer: Node): Node | null {
  let parent = fiber.return;
  while (parent !== null) {
    if (parent.tag === FiberTag.HostComponent && parent.stateNode) {
      return parent.stateNode as Node;
    }
    if (parent.tag === FiberTag.HostRoot) {
      return rootContainer;
    }
    parent = parent.return;
  }
  return rootContainer;
}

// ---------------------------------------------------------------------------
// Complete phase: create/update DOM nodes bottom-up
// ---------------------------------------------------------------------------

function completeWork(fiber: Fiber): void {
  switch (fiber.tag) {
    case FiberTag.HostComponent: {
      if (fiber.stateNode === null) {
        // Normal path: create new DOM node
        const tag = fiber.type as string;
        const domNode = isSvgTag(tag)
          ? document.createElementNS('http://www.w3.org/2000/svg', tag)
          : document.createElement(tag);
        updateDOMProperties(domNode as HTMLElement, {}, fiber.pendingProps);
        fiber.stateNode = domNode;
        appendAllChildren(domNode as HTMLElement, fiber);
      } else if (activeHydrationRoot !== null && fiber.alternate === null) {
        // Hydrated node: stateNode was set during beginWork
        // Attach event listeners and update props, but don't recreate or append children
        updateDOMProperties(fiber.stateNode as HTMLElement, {}, fiber.pendingProps);
        // Mark as hydrated — no Placement needed, node is already in DOM
        fiber.effectTag = EffectTag.NoEffect;
      } else {
        // Update existing node (normal re-render)
        const domNode = fiber.stateNode as HTMLElement;
        if (fiber.alternate) {
          updateDOMProperties(domNode, fiber.alternate.memoizedProps || {}, fiber.pendingProps);
        }
      }
      fiber.memoizedProps = fiber.pendingProps;
      break;
    }
    case FiberTag.HostText: {
      const text = String((fiber.pendingProps as unknown as { text: string | number }).text);
      if (fiber.stateNode === null) {
        // Normal path: create new text node
        fiber.stateNode = document.createTextNode(text);
      } else if (activeHydrationRoot !== null && fiber.alternate === null) {
        // Hydrated text node: stateNode was set during beginWork
        const existing = fiber.stateNode as Text;
        if (existing.nodeValue !== text) {
          existing.nodeValue = text;
        }
        // Mark as hydrated — no Placement needed
        fiber.effectTag = EffectTag.NoEffect;
      } else {
        (fiber.stateNode as Text).nodeValue = text;
      }
      fiber.memoizedProps = fiber.pendingProps;
      break;
    }
    case FiberTag.HostRoot:
    case FiberTag.FunctionComponent:
    case FiberTag.ClassComponent:
    case FiberTag.Fragment:
    case FiberTag.ContextProvider:
    case FiberTag.ForwardRef:
    case FiberTag.MemoComponent:
      // Decrement StrictMode depth when completing a StrictMode fiber
      if (fiber.type === LIQUID_STRICT_MODE_TYPE) {
        strictModeDepth--;
      }
      fiber.memoizedProps = fiber.pendingProps;
      break;
  }
}

/**
 * Append all child DOM nodes to a parent host element.
 * Skips non-host fibers (components, fragments) and descends into them.
 */
function appendAllChildren(parent: HTMLElement, fiber: Fiber): void {
  let child = fiber.child;
  while (child !== null) {
    if (child.tag === FiberTag.HostComponent || child.tag === FiberTag.HostText) {
      if (child.stateNode) {
        parent.appendChild(child.stateNode as Node);
      }
    } else if (child.child !== null) {
      // Descend into non-host fibers
      child.child.return = child;
      child = child.child;
      continue;
    }

    if (child === fiber) return;

    while (child.sibling === null) {
      if (child.return === null || child.return === fiber) return;
      child = child.return;
    }
    child.sibling.return = child.return;
    child = child.sibling;
  }
}

// ---------------------------------------------------------------------------
// Commit phase: mutate real DOM
// ---------------------------------------------------------------------------

function commitRoot(root: FiberRoot, finishedWork: Fiber): void {
  // Commit deletions first
  commitDeletions(finishedWork);

  // Commit placements and updates
  commitWork(finishedWork, root.containerNode);

  // Run effects
  commitEffects(finishedWork);

  // Notify DevTools
  notifyDevToolsOfCommit(root);
}

function commitDeletions(fiber: Fiber): void {
  // Process deletions tracked in updateQueue
  if (fiber.updateQueue && Array.isArray(fiber.updateQueue)) {
    for (const item of fiber.updateQueue as unknown[]) {
      const deletedFiber = item as Fiber;
      if (deletedFiber.effectTag === EffectTag.Deletion) {
        commitDeletion(deletedFiber);
      }
    }
  }

  let child = fiber.child;
  while (child !== null) {
    commitDeletions(child);
    child = child.sibling;
  }
}

function commitDeletion(fiber: Fiber): void {
  // Find the nearest host parent
  let parentFiber = fiber.return;
  while (parentFiber !== null) {
    if (parentFiber.tag === FiberTag.HostComponent || parentFiber.tag === FiberTag.HostRoot) {
      break;
    }
    parentFiber = parentFiber.return;
  }

  const parentDOM = parentFiber?.stateNode as Element | null;
  if (!parentDOM) return;

  // Remove host nodes from this fiber subtree
  removeHostChildren(fiber, parentDOM);

  // Run cleanup effects
  runCleanupEffects(fiber);
}

function removeHostChildren(fiber: Fiber, parentDOM: Element): void {
  if (fiber.tag === FiberTag.HostComponent || fiber.tag === FiberTag.HostText) {
    if (fiber.stateNode && parentDOM.contains(fiber.stateNode as Node)) {
      parentDOM.removeChild(fiber.stateNode as Node);
    }
  } else {
    let child = fiber.child;
    while (child !== null) {
      removeHostChildren(child, parentDOM);
      child = child.sibling;
    }
  }
}

function commitWork(fiber: Fiber, container: Element | DocumentFragment): void {
  if (fiber.tag === FiberTag.HostRoot) {
    // Root: process children
    let child = fiber.child;
    while (child !== null) {
      commitWork(child, container);
      child = child.sibling;
    }
    return;
  }

  if (
    (fiber.tag === FiberTag.HostComponent || fiber.tag === FiberTag.HostText) &&
    fiber.effectTag & EffectTag.Placement
  ) {
    // Find the parent DOM node
    const parentDOM = getHostParentNode(fiber, container);
    if (parentDOM && fiber.stateNode) {
      // Find the next sibling DOM node for insertion order
      const before = getHostSibling(fiber);
      if (before) {
        parentDOM.insertBefore(fiber.stateNode as Node, before);
      } else {
        parentDOM.appendChild(fiber.stateNode as Node);
      }
    }
  }

  // Process children
  let child = fiber.child;
  while (child !== null) {
    commitWork(child, container);
    child = child.sibling;
  }
}

function getHostParentNode(
  fiber: Fiber,
  rootContainer: Element | DocumentFragment,
): Element | DocumentFragment | null {
  let parent = fiber.return;
  while (parent !== null) {
    if (parent.tag === FiberTag.HostComponent) {
      return parent.stateNode as Element;
    }
    if (parent.tag === FiberTag.HostRoot) {
      return rootContainer;
    }
    parent = parent.return;
  }
  return null;
}

function getHostSibling(fiber: Fiber): Node | null {
  let node: Fiber | null = fiber;

  outer: while (true) {
    while (node.sibling === null) {
      if (node.return === null || isHostParent(node.return)) {
        return null;
      }
      node = node.return;
    }
    node = node.sibling;

    // Descend into non-host fibers to find host nodes
    while (node.tag !== FiberTag.HostComponent && node.tag !== FiberTag.HostText) {
      if (node.effectTag & EffectTag.Placement) {
        continue outer;
      }
      if (node.child === null) {
        continue outer;
      }
      node = node.child;
    }

    if (!(node.effectTag & EffectTag.Placement)) {
      return node.stateNode as Node;
    }
  }
}

function isHostParent(fiber: Fiber): boolean {
  return fiber.tag === FiberTag.HostComponent || fiber.tag === FiberTag.HostRoot;
}

// ---------------------------------------------------------------------------
// Effects
// ---------------------------------------------------------------------------

function commitEffects(fiber: Fiber): void {
  // Attach refs
  if (fiber.ref && fiber.stateNode) {
    if (typeof fiber.ref === 'function') {
      fiber.ref(fiber.stateNode);
    } else if (typeof fiber.ref === 'object') {
      (fiber.ref as { current: unknown }).current = fiber.stateNode;
    }
  }

  // Process this fiber's effects
  if (
    fiber.tag === FiberTag.FunctionComponent ||
    fiber.tag === FiberTag.ForwardRef ||
    fiber.tag === FiberTag.MemoComponent
  ) {
    const effectList = fiber.dependencies as EffectHook | null;
    if (effectList) {
      runEffects(effectList);
    }
  }

  // Class component lifecycle
  if (fiber.tag === FiberTag.ClassComponent && fiber.stateNode) {
    const instance = fiber.stateNode as ClassComponentInstance;
    if (fiber.alternate === null) {
      // Mount
      instance.componentDidMount?.();
    } else {
      // Update
      const prevProps = fiber.alternate.memoizedProps || ({} as Props);
      const prevState = fiber.alternate.memoizedState;
      instance.componentDidUpdate?.(prevProps, prevState);
    }
  }

  let child = fiber.child;
  while (child !== null) {
    commitEffects(child);
    child = child.sibling;
  }
}

function runEffects(effect: EffectHook): void {
  let current: EffectHook | null = effect;
  while (current !== null) {
    if (current.tag & EffectHookTag.HasEffect) {
      // Run cleanup from previous render
      if (current.destroy) {
        current.destroy();
      }
      // Run the new effect
      const destroy = current.create();
      current.destroy = typeof destroy === 'function' ? destroy : null;
    }
    current = current.next;
  }
}

function runCleanupEffects(fiber: Fiber): void {
  if (fiber.tag === FiberTag.FunctionComponent || fiber.tag === FiberTag.ForwardRef) {
    const effectList = fiber.dependencies as EffectHook | null;
    if (effectList) {
      let current: EffectHook | null = effectList;
      while (current !== null) {
        if (current.destroy) {
          current.destroy();
        }
        current = current.next;
      }
    }
  }

  if (fiber.tag === FiberTag.ClassComponent && fiber.stateNode) {
    (fiber.stateNode as ClassComponentInstance).componentWillUnmount?.();
  }

  let child = fiber.child;
  while (child !== null) {
    runCleanupEffects(child);
    child = child.sibling;
  }
}

// ---------------------------------------------------------------------------
// DOM property updates
// ---------------------------------------------------------------------------

const EVENT_RE = /^on[A-Z]/;

export function updateDOMProperties(
  dom: HTMLElement,
  prevProps: Props | Record<string, unknown>,
  nextProps: Props,
): void {
  // Remove old props
  for (const key in prevProps) {
    if (key === 'children' || key === 'key' || key === 'ref') continue;
    if (!(key in nextProps)) {
      if (EVENT_RE.test(key)) {
        const eventName = key.slice(2).toLowerCase();
        dom.removeEventListener(eventName, prevProps[key] as EventListener);
      } else if (key === 'style') {
        dom.removeAttribute('style');
      } else if (key === 'className') {
        dom.removeAttribute('class');
      } else if (key === 'htmlFor') {
        dom.removeAttribute('for');
      } else if (key === 'dangerouslySetInnerHTML') {
        dom.innerHTML = '';
      } else {
        dom.removeAttribute(key);
      }
    }
  }

  // Set new props
  for (const key in nextProps) {
    if (key === 'children' || key === 'key' || key === 'ref') continue;

    const value = nextProps[key];

    if (EVENT_RE.test(key)) {
      const eventName = key.slice(2).toLowerCase();
      // Remove old handler if different
      if (prevProps[key] !== value) {
        if (prevProps[key]) {
          dom.removeEventListener(eventName, prevProps[key] as EventListener);
        }
        if (value) {
          dom.addEventListener(eventName, value as EventListener);
        }
      }
    } else if (key === 'style') {
      if (typeof value === 'object' && value !== null) {
        const style = value as Record<string, string>;
        for (const prop in style) {
          (dom.style as unknown as Record<string, string>)[prop] = style[prop] ?? '';
        }
      }
    } else if (key === 'className') {
      dom.setAttribute('class', String(value));
    } else if (key === 'htmlFor') {
      dom.setAttribute('for', String(value));
    } else if (key === 'dangerouslySetInnerHTML') {
      const html = (value as { __html: string }).__html;
      dom.innerHTML = html;
    } else if (
      key === 'value' &&
      (dom.tagName === 'INPUT' || dom.tagName === 'TEXTAREA' || dom.tagName === 'SELECT')
    ) {
      (dom as HTMLInputElement).value = String(value ?? '');
    } else if (key === 'checked' && dom.tagName === 'INPUT') {
      (dom as HTMLInputElement).checked = Boolean(value);
    } else if (typeof value === 'boolean') {
      if (value) {
        dom.setAttribute(key, '');
      } else {
        dom.removeAttribute(key);
      }
    } else if (value != null) {
      // For custom elements (Web Components), set complex values as properties
      // rather than attributes to support object/array/function props
      if (isCustomElement(dom) && typeof value !== 'string' && key in dom) {
        (dom as unknown as Record<string, unknown>)[key] = value;
      } else {
        dom.setAttribute(key, String(value));
      }
    } else {
      dom.removeAttribute(key);
    }
  }
}

// Export for the createRoot module
export { fiberRoots };
