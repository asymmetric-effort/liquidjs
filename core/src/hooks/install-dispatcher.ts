// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

/**
 * Installs the concrete hook implementations as the active dispatcher.
 * Called by the work loop before rendering a function component.
 */

import { __setDispatcher } from './index';
import {
  useStateImpl,
  useReducerImpl,
  useEffectDispatch,
  useLayoutEffectDispatch,
  useInsertionEffectDispatch,
  useContextImpl,
  useCallbackImpl,
  useMemoImpl,
  useRefImpl,
  useImperativeHandleImpl,
  useDebugValueImpl,
  useIdImpl,
  useDeferredValueImpl,
  useTransitionImpl,
  useSyncExternalStoreImpl,
} from './dispatcher';

const HooksDispatcher = {
  useState: useStateImpl,
  useEffect: useEffectDispatch,
  useContext: useContextImpl,
  useReducer: useReducerImpl,
  useCallback: useCallbackImpl,
  useMemo: useMemoImpl,
  useRef: useRefImpl,
  useImperativeHandle: useImperativeHandleImpl,
  useLayoutEffect: useLayoutEffectDispatch,
  useDebugValue: useDebugValueImpl,
  useId: useIdImpl,
  useDeferredValue: useDeferredValueImpl,
  useTransition: useTransitionImpl,
  useSyncExternalStore: useSyncExternalStoreImpl,
  useInsertionEffect: useInsertionEffectDispatch,
};

export function installDispatcher(): void {
  __setDispatcher(HooksDispatcher as Parameters<typeof __setDispatcher>[0]);
}

export function uninstallDispatcher(): void {
  __setDispatcher(null);
}
