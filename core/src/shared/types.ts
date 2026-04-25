// ============================================================================
// LiquidJS Core Types
// ============================================================================
// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

/** Unique symbol to identify LiquidJS elements */
export const LIQUID_ELEMENT_TYPE = Symbol.for('liquid.element');
export const LIQUID_FRAGMENT_TYPE = Symbol.for('liquid.fragment');
export const LIQUID_PORTAL_TYPE = Symbol.for('liquid.portal');
export const LIQUID_PROVIDER_TYPE = Symbol.for('liquid.provider');
export const LIQUID_CONSUMER_TYPE = Symbol.for('liquid.consumer');
export const LIQUID_FORWARD_REF_TYPE = Symbol.for('liquid.forward_ref');
export const LIQUID_MEMO_TYPE = Symbol.for('liquid.memo');
export const LIQUID_LAZY_TYPE = Symbol.for('liquid.lazy');
export const LIQUID_SUSPENSE_TYPE = Symbol.for('liquid.suspense');
export const LIQUID_STRICT_MODE_TYPE = Symbol.for('liquid.strict_mode');
export const LIQUID_PROFILER_TYPE = Symbol.for('liquid.profiler');

/** A key used for reconciliation */
export type Key = string | number | null;

/** A ref can be a callback, an object, or null */
export type Ref<T = unknown> = RefCallback<T> | RefObject<T> | null;
export type RefCallback<T> = (instance: T | null) => void;
export interface RefObject<T> {
  current: T | null;
}

/** Props are an arbitrary key-value map */
export type Props = Record<string, unknown> & {
  children?: LiquidNode;
  key?: Key;
  ref?: Ref;
};

/** Valid child types in a LiquidJS tree */
export type LiquidChild = LiquidElement | string | number | boolean | null | undefined;
export type LiquidNode = LiquidChild | LiquidNode[];

/** A functional component */
export type FunctionComponent<P extends Props = Props> = (props: P) => LiquidNode;

/** A class component constructor */
export interface ClassComponentConstructor<P extends Props = Props, S = unknown> {
  new (props: P): ClassComponentInstance<P, S>;
  getDerivedStateFromProps?(props: P, state: S): Partial<S> | null;
  getDerivedStateFromError?(error: unknown): Partial<S> | null;
}

/** Instance of a class component */
export interface ClassComponentInstance<P extends Props = Props, S = unknown> {
  props: P;
  state: S;
  setState(updater: Partial<S> | ((prevState: S, props: P) => Partial<S> | null)): void;
  forceUpdate(callback?: () => void): void;
  render(): LiquidNode;
  componentDidMount?(): void;
  componentDidUpdate?(prevProps: P, prevState: S, snapshot?: unknown): void;
  componentWillUnmount?(): void;
  shouldComponentUpdate?(nextProps: P, nextState: S): boolean;
  getSnapshotBeforeUpdate?(prevProps: P, prevState: S): unknown;
  componentDidCatch?(error: unknown, info: ErrorInfo): void;
}

export interface ErrorInfo {
  componentStack: string;
}

/** A component type can be a function, a class, or a special symbol type */
export type ComponentType<P extends Props = Props> =
  | FunctionComponent<P>
  | ClassComponentConstructor<P>
  | string
  | symbol;

/** The core element structure — equivalent to React.Element */
export interface LiquidElement<P extends Props = Props> {
  $$typeof: typeof LIQUID_ELEMENT_TYPE;
  type: ComponentType<P>;
  props: P;
  key: Key;
  ref: Ref;
}

/** Fiber node types for the reconciler */
export const enum FiberTag {
  FunctionComponent = 0,
  ClassComponent = 1,
  HostRoot = 2,
  HostComponent = 3,
  HostText = 4,
  Fragment = 5,
  ContextProvider = 6,
  ContextConsumer = 7,
  ForwardRef = 8,
  MemoComponent = 9,
  LazyComponent = 10,
  SuspenseComponent = 11,
  Profiler = 12,
  Portal = 13,
}

/** Effect flags for fiber work */
export const enum EffectTag {
  NoEffect = 0,
  Placement = 1,
  Update = 2,
  Deletion = 4,
  ChildDeletion = 8,
  Snapshot = 16,
  Passive = 32,
  Layout = 64,
  Ref = 128,
}

/** Fiber node — the internal work unit */
export interface Fiber<P extends Props = Props> {
  tag: FiberTag;
  type: ComponentType<P> | null;
  key: Key;
  ref: Ref;

  stateNode: unknown;
  pendingProps: P;
  memoizedProps: P | null;
  memoizedState: unknown;

  return: Fiber | null;
  child: Fiber | null;
  sibling: Fiber | null;
  index: number;

  alternate: Fiber | null;
  effectTag: EffectTag;

  updateQueue: unknown;
  dependencies: unknown;

  lanes: number;
  childLanes: number;
}

/** Context type */
export interface LiquidContext<T> {
  $$typeof: symbol;
  Provider: ComponentType;
  Consumer: ComponentType;
  _currentValue: T;
  _defaultValue: T;
  displayName?: string;
}
