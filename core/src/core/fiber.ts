// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import {
  type Fiber,
  type Props,
  type ComponentType,
  type Key,
  type Ref,
  type LiquidElement,
  type LiquidNode,
  FiberTag,
  EffectTag,
  LIQUID_FRAGMENT_TYPE,
  LIQUID_FORWARD_REF_TYPE,
  LIQUID_MEMO_TYPE,
  LIQUID_SUSPENSE_TYPE,
  LIQUID_STRICT_MODE_TYPE,
  LIQUID_PROFILER_TYPE,
  LIQUID_PORTAL_TYPE,
  LIQUID_PROVIDER_TYPE,
  LIQUID_CONSUMER_TYPE,
} from '../shared/types';
import { isValidElement } from './is-valid-element';

/**
 * Determines the fiber tag for a given element type.
 */
export function getFiberTag(type: ComponentType): FiberTag {
  if (typeof type === 'string') {
    return FiberTag.HostComponent;
  }
  if (typeof type === 'function') {
    if ((type.prototype as Record<string, unknown>)?.isLiquidComponent) {
      return FiberTag.ClassComponent;
    }
    return FiberTag.FunctionComponent;
  }
  if (typeof type === 'symbol') {
    if (type === LIQUID_FRAGMENT_TYPE) return FiberTag.Fragment;
    if (type === LIQUID_SUSPENSE_TYPE) return FiberTag.SuspenseComponent;
    if (type === LIQUID_STRICT_MODE_TYPE) return FiberTag.Fragment; // StrictMode renders as fragment
    if (type === LIQUID_PROFILER_TYPE) return FiberTag.Profiler;
    if (type === LIQUID_PORTAL_TYPE) return FiberTag.Portal;
  }
  if (typeof type === 'object' && type !== null) {
    const $$typeof = (type as { $$typeof?: symbol }).$$typeof;
    if ($$typeof === LIQUID_FORWARD_REF_TYPE) return FiberTag.ForwardRef;
    if ($$typeof === LIQUID_MEMO_TYPE) return FiberTag.MemoComponent;
    if ($$typeof === LIQUID_PROVIDER_TYPE) return FiberTag.ContextProvider;
    if ($$typeof === LIQUID_CONSUMER_TYPE) return FiberTag.ContextConsumer;
  }
  return FiberTag.HostComponent;
}

/**
 * Creates a new fiber from a LiquidJS element.
 */
export function createFiberFromElement(element: LiquidElement, lanes: number = 0): Fiber {
  const tag = getFiberTag(element.type);

  return createFiber(tag, element.type, element.key, element.ref, element.props, lanes);
}

/**
 * Creates a fiber for a text node.
 */
export function createFiberFromText(content: string | number, lanes: number = 0): Fiber {
  return createFiber(
    FiberTag.HostText,
    null,
    null,
    null,
    { text: content } as unknown as Props,
    lanes,
  );
}

/**
 * Creates the root fiber for a container.
 */
export function createHostRootFiber(): Fiber {
  return createFiber(FiberTag.HostRoot, null, null, null, {} as Props, 0);
}

/**
 * Core fiber constructor.
 */
export function createFiber(
  tag: FiberTag,
  type: ComponentType | null,
  key: Key,
  ref: Ref,
  pendingProps: Props,
  lanes: number,
): Fiber {
  return {
    tag,
    type,
    key,
    ref,
    stateNode: null,
    pendingProps,
    memoizedProps: null,
    memoizedState: null,
    return: null,
    child: null,
    sibling: null,
    index: 0,
    alternate: null,
    effectTag: EffectTag.NoEffect,
    updateQueue: null,
    dependencies: null,
    lanes,
    childLanes: 0,
  };
}

/**
 * Creates a working-in-progress clone of an existing fiber.
 */
export function createWorkInProgress(current: Fiber, pendingProps: Props): Fiber {
  let wip = current.alternate;

  if (wip === null) {
    wip = createFiber(
      current.tag,
      current.type,
      current.key,
      current.ref,
      pendingProps,
      current.lanes,
    );
    wip.stateNode = current.stateNode;
    wip.alternate = current;
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
  wip.lanes = current.lanes;
  wip.childLanes = current.childLanes;

  return wip;
}

/**
 * Converts LiquidNode children into fiber-compatible form.
 */
export function coerceToFiberChildren(
  children: LiquidNode,
): Array<LiquidElement | string | number> {
  if (children == null || typeof children === 'boolean') {
    return [];
  }
  if (Array.isArray(children)) {
    const result: Array<LiquidElement | string | number> = [];
    for (const child of children) {
      result.push(...coerceToFiberChildren(child));
    }
    return result;
  }
  if (isValidElement(children)) {
    return [children as LiquidElement];
  }
  if (typeof children === 'string' || typeof children === 'number') {
    return [children];
  }
  return [];
}
