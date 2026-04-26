// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import {
  type Fiber,
  type Props,
  type SpecElement,
  type SpecNode,
  type Key,
  FiberTag,
  EffectTag,
} from '../shared/types';
import { isValidElement } from './is-valid-element';
import { createFiberFromElement, createFiberFromText, coerceToFiberChildren } from './fiber';

/**
 * The reconciler is responsible for diffing old and new virtual trees,
 * producing a set of fiber effects (placement, update, deletion) that
 * the renderer can apply to the host environment (DOM).
 */

/**
 * Reconciles the children of a fiber, producing a linked list of child fibers.
 * This implements React's reconciliation algorithm including keyed diffing.
 */
export function reconcileChildren(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  newChildren: SpecNode,
  lanes: number,
): Fiber | null {
  // Normalize to array
  const elements = coerceToFiberChildren(newChildren);

  if (elements.length === 0) {
    // Delete all existing children
    deleteRemainingChildren(returnFiber, currentFirstChild);
    return null;
  }

  // Single element optimization
  if (elements.length === 1 && !Array.isArray(elements[0])) {
    return reconcileSingleChild(returnFiber, currentFirstChild, elements[0]!, lanes);
  }

  // Multi-child reconciliation with keyed diffing
  return reconcileChildArray(returnFiber, currentFirstChild, elements, lanes);
}

/**
 * Reconcile when there's only a single new child.
 */
function reconcileSingleChild(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  element: SpecElement | string | number,
  lanes: number,
): Fiber {
  if (typeof element === 'string' || typeof element === 'number') {
    return reconcileSingleTextNode(returnFiber, currentFirstChild, element, lanes);
  }

  const key = element.key;
  let child = currentFirstChild;

  // Search existing children for a match by key and type
  while (child !== null) {
    if (child.key === key) {
      if (isSameType(child, element)) {
        // Reuse this fiber, delete siblings
        deleteRemainingChildren(returnFiber, child.sibling);
        const existing = useFiber(child, element.props);
        existing.ref = element.ref;
        existing.return = returnFiber;
        return existing;
      }
      // Key matches but type differs — delete this and all siblings
      deleteRemainingChildren(returnFiber, child);
      break;
    } else {
      // Key doesn't match, mark for deletion
      deleteChild(returnFiber, child);
    }
    child = child.sibling;
  }

  // No match found — create new fiber
  const created = createFiberFromElement(element, lanes);
  created.ref = element.ref;
  created.return = returnFiber;
  created.effectTag = EffectTag.Placement;
  return created;
}

/**
 * Reconcile a single text node.
 */
function reconcileSingleTextNode(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  content: string | number,
  lanes: number,
): Fiber {
  // If there's an existing text node, reuse it
  if (currentFirstChild !== null && currentFirstChild.tag === FiberTag.HostText) {
    deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
    const existing = useFiber(currentFirstChild, { text: content } as unknown as Props);
    existing.return = returnFiber;
    return existing;
  }

  // Delete all existing children and create a fresh text fiber
  deleteRemainingChildren(returnFiber, currentFirstChild);
  const created = createFiberFromText(content, lanes);
  created.return = returnFiber;
  created.effectTag = EffectTag.Placement;
  return created;
}

/**
 * Multi-child reconciliation using React's two-pass algorithm:
 * 1. Linear scan for in-order matches
 * 2. Map-based search for out-of-order matches
 */
function reconcileChildArray(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  newChildren: Array<SpecElement | string | number>,
  lanes: number,
): Fiber | null {
  let resultingFirstChild: Fiber | null = null;
  let previousNewFiber: Fiber | null = null;

  let oldFiber = currentFirstChild;
  let newIdx = 0;
  let lastPlacedIndex = 0;
  let nextOldFiber: Fiber | null = null;

  // Pass 1: Walk old and new children in order, matching by key
  for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
    if (oldFiber.index > newIdx) {
      nextOldFiber = oldFiber;
      oldFiber = null;
    } else {
      nextOldFiber = oldFiber.sibling;
    }

    const newChild = newChildren[newIdx]!;
    const newFiber = updateSlot(returnFiber, oldFiber, newChild, lanes);

    if (newFiber === null) {
      // Keys don't match — break out to pass 2
      if (oldFiber === null) {
        oldFiber = nextOldFiber;
      }
      break;
    }

    if (oldFiber && newFiber.alternate === null) {
      // New fiber was created (not reused), delete the old one
      deleteChild(returnFiber, oldFiber);
    }

    lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);

    if (previousNewFiber === null) {
      resultingFirstChild = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
    oldFiber = nextOldFiber;
  }

  // If we've consumed all new children, delete remaining old ones
  if (newIdx === newChildren.length) {
    deleteRemainingChildren(returnFiber, oldFiber);
    return resultingFirstChild;
  }

  // If no more old children, append remaining new children
  if (oldFiber === null) {
    for (; newIdx < newChildren.length; newIdx++) {
      const newFiber = createChild(returnFiber, newChildren[newIdx]!, lanes);
      if (newFiber === null) continue;

      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);

      if (previousNewFiber === null) {
        resultingFirstChild = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
    }
    return resultingFirstChild;
  }

  // Pass 2: Build a map of remaining old children by key, then match
  const existingChildren = mapRemainingChildren(oldFiber);

  for (; newIdx < newChildren.length; newIdx++) {
    const newChild = newChildren[newIdx]!;
    const newFiber = updateFromMap(returnFiber, existingChildren, newChild, newIdx, lanes);

    if (newFiber !== null) {
      if (newFiber.alternate !== null) {
        // We reused an existing fiber — remove it from the map
        const key = newFiber.key !== null ? newFiber.key : newIdx;
        existingChildren.delete(key);
      }

      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);

      if (previousNewFiber === null) {
        resultingFirstChild = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
    }
  }

  // Delete any remaining old children that weren't matched
  existingChildren.forEach((child) => {
    deleteChild(returnFiber, child);
  });

  return resultingFirstChild;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isSameType(fiber: Fiber, element: SpecElement): boolean {
  return fiber.type === element.type;
}

function useFiber(fiber: Fiber, pendingProps: Props): Fiber {
  const clone = createWorkInProgressFromFiber(fiber, pendingProps);
  clone.index = 0;
  clone.sibling = null;
  return clone;
}

function createWorkInProgressFromFiber(current: Fiber, pendingProps: Props): Fiber {
  let wip = current.alternate;

  if (wip === null) {
    wip = {
      ...current,
      pendingProps,
      effectTag: EffectTag.NoEffect,
      child: null,
      sibling: null,
      alternate: current,
    };
    current.alternate = wip;
  } else {
    wip.pendingProps = pendingProps;
    wip.effectTag = EffectTag.NoEffect;
    wip.child = null;
    wip.sibling = null;
  }

  wip.memoizedProps = current.memoizedProps;
  wip.memoizedState = current.memoizedState;
  wip.updateQueue = current.updateQueue;

  return wip;
}

function updateSlot(
  returnFiber: Fiber,
  oldFiber: Fiber | null,
  newChild: SpecElement | string | number,
  lanes: number,
): Fiber | null {
  const oldKey = oldFiber !== null ? oldFiber.key : null;

  // Text nodes have no key
  if (typeof newChild === 'string' || typeof newChild === 'number') {
    if (oldKey !== null) return null; // Key mismatch
    return updateTextNode(returnFiber, oldFiber, newChild, lanes);
  }

  // Element nodes
  if (isValidElement(newChild)) {
    const element = newChild as SpecElement;
    if (element.key === oldKey) {
      return updateElement(returnFiber, oldFiber, element, lanes);
    }
    return null; // Key mismatch
  }

  return null;
}

function updateTextNode(
  returnFiber: Fiber,
  current: Fiber | null,
  content: string | number,
  lanes: number,
): Fiber {
  if (current === null || current.tag !== FiberTag.HostText) {
    const created = createFiberFromText(content, lanes);
    created.return = returnFiber;
    created.effectTag = EffectTag.Placement;
    return created;
  }
  const existing = useFiber(current, { text: content } as unknown as Props);
  existing.return = returnFiber;
  return existing;
}

function updateElement(
  returnFiber: Fiber,
  current: Fiber | null,
  element: SpecElement,
  lanes: number,
): Fiber {
  if (current !== null && current.type === element.type) {
    const existing = useFiber(current, element.props);
    existing.ref = element.ref;
    existing.return = returnFiber;
    return existing;
  }
  const created = createFiberFromElement(element, lanes);
  created.ref = element.ref;
  created.return = returnFiber;
  created.effectTag = EffectTag.Placement;
  return created;
}

function createChild(
  returnFiber: Fiber,
  newChild: SpecElement | string | number,
  lanes: number,
): Fiber | null {
  if (typeof newChild === 'string' || typeof newChild === 'number') {
    const created = createFiberFromText(newChild, lanes);
    created.return = returnFiber;
    created.effectTag = EffectTag.Placement;
    return created;
  }
  if (isValidElement(newChild)) {
    const created = createFiberFromElement(newChild as SpecElement, lanes);
    created.ref = (newChild as SpecElement).ref;
    created.return = returnFiber;
    created.effectTag = EffectTag.Placement;
    return created;
  }
  return null;
}

function placeChild(fiber: Fiber, lastPlacedIndex: number, newIndex: number): number {
  fiber.index = newIndex;

  const current = fiber.alternate;
  if (current !== null) {
    const oldIndex = current.index;
    if (oldIndex < lastPlacedIndex) {
      // This item moved forward
      fiber.effectTag = EffectTag.Placement;
      return lastPlacedIndex;
    }
    return oldIndex;
  }
  // New insertion
  fiber.effectTag = EffectTag.Placement;
  return lastPlacedIndex;
}

function deleteChild(returnFiber: Fiber, childToDelete: Fiber): void {
  childToDelete.effectTag = EffectTag.Deletion;
  // Track deletions on the parent
  if (!returnFiber.updateQueue) {
    returnFiber.updateQueue = [];
  }
  (returnFiber.updateQueue as Fiber[]).push(childToDelete);
}

function deleteRemainingChildren(returnFiber: Fiber, currentFirstChild: Fiber | null): void {
  let child = currentFirstChild;
  while (child !== null) {
    deleteChild(returnFiber, child);
    child = child.sibling;
  }
}

function mapRemainingChildren(currentFirstChild: Fiber): Map<Key | number, Fiber> {
  const map = new Map<Key | number, Fiber>();
  let child: Fiber | null = currentFirstChild;
  while (child !== null) {
    const key = child.key !== null ? child.key : child.index;
    map.set(key, child);
    child = child.sibling;
  }
  return map;
}

function updateFromMap(
  returnFiber: Fiber,
  existingChildren: Map<Key | number, Fiber>,
  newChild: SpecElement | string | number,
  newIndex: number,
  lanes: number,
): Fiber | null {
  if (typeof newChild === 'string' || typeof newChild === 'number') {
    const matchedFiber = existingChildren.get(newIndex) || null;
    return updateTextNode(returnFiber, matchedFiber, newChild, lanes);
  }

  if (isValidElement(newChild)) {
    const element = newChild as SpecElement;
    const key = element.key !== null ? element.key : newIndex;
    const matchedFiber = existingChildren.get(key) || null;
    return updateElement(returnFiber, matchedFiber, element, lanes);
  }

  return null;
}
