// ============================================================================
// LiquidJS — Core Public API
// ============================================================================

export { createElement, createElement as h } from './core/create-element';
export { Fragment } from './core/fragment';
export { createContext } from './context/create-context';
export { createRef } from './core/create-ref';
export { forwardRef } from './core/forward-ref';
export { memo } from './core/memo';
export { lazy } from './core/lazy';
export { isValidElement } from './core/is-valid-element';
export { cloneElement } from './core/clone-element';
export { Children } from './core/children';
export { Component, PureComponent } from './components/component';

// Hooks
export {
  useState,
  useEffect,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
  useLayoutEffect,
  useDebugValue,
  useId,
  useDeferredValue,
  useTransition,
  useSyncExternalStore,
  useInsertionEffect,
} from './hooks/index';

// Special component types
export { Suspense } from './components/suspense';
export { StrictMode } from './components/strict-mode';
export { Profiler } from './components/profiler';

// Utilities
export { startTransition } from './core/transitions';
export { act } from './shared/act';

// Types
export type {
  LiquidElement,
  LiquidNode,
  LiquidChild,
  Props,
  Key,
  Ref,
  RefObject,
  RefCallback,
  FunctionComponent,
  ClassComponentConstructor,
  ClassComponentInstance,
  LiquidContext,
  ErrorInfo,
  Fiber,
} from './shared/types';
