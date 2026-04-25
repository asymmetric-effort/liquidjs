// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

/**
 * DevTools integration hooks.
 * Allows browser extensions to inspect the LiquidJS component tree.
 */

import type { Fiber } from '../shared/types';

interface DevToolsHook {
  onCommitFiberRoot?: (root: unknown) => void;
  onCommitFiberUnmount?: (fiber: Fiber) => void;
  supportsFiber?: boolean;
}

let devToolsHook: DevToolsHook | null = null;

/**
 * Connect to DevTools if available (e.g., via browser extension).
 */
export function connectDevTools(): void {
  if (
    typeof globalThis !== 'undefined' &&
    (globalThis as unknown as { __LIQUID_DEVTOOLS_GLOBAL_HOOK__?: DevToolsHook })
      .__LIQUID_DEVTOOLS_GLOBAL_HOOK__
  ) {
    devToolsHook = (globalThis as unknown as { __LIQUID_DEVTOOLS_GLOBAL_HOOK__: DevToolsHook })
      .__LIQUID_DEVTOOLS_GLOBAL_HOOK__;
  }
}

/**
 * Notify DevTools of a commit.
 */
export function notifyDevToolsOfCommit(root: unknown): void {
  devToolsHook?.onCommitFiberRoot?.(root);
}

/**
 * Notify DevTools of an unmount.
 */
export function notifyDevToolsOfUnmount(fiber: Fiber): void {
  devToolsHook?.onCommitFiberUnmount?.(fiber);
}

/**
 * Check if DevTools is connected.
 */
export function isDevToolsConnected(): boolean {
  return devToolsHook !== null;
}
