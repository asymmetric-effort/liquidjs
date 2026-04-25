// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

/**
 * Transition system for marking non-urgent updates.
 *
 * Integrates with the lane system to assign lower priority to state updates
 * made inside startTransition. Also tracks flushSync context.
 */

import { DefaultLane, SyncLane, claimNextTransitionLane } from './lanes';

// ---------------------------------------------------------------------------
// Lane context — tracks which lane new updates should be assigned to
// ---------------------------------------------------------------------------

let currentUpdateLane: number = DefaultLane;
let isTransitionPending = false;
let isFlushSyncContext = false;
let transitionCallbacks: (() => void)[] = [];

/**
 * Get the lane that should be assigned to a new state update.
 * Respects the current context: flushSync → SyncLane,
 * startTransition → TransitionLane, else DefaultLane.
 */
export function requestUpdateLane(): number {
  if (isFlushSyncContext) {
    return SyncLane;
  }
  return currentUpdateLane;
}

/**
 * Enter flushSync context. State updates within will use SyncLane.
 */
export function enterFlushSyncContext(): void {
  isFlushSyncContext = true;
}

/**
 * Exit flushSync context.
 */
export function exitFlushSyncContext(): void {
  isFlushSyncContext = false;
}

// ---------------------------------------------------------------------------
// startTransition
// ---------------------------------------------------------------------------

/**
 * Marks a state update as a transition (non-urgent).
 * Equivalent to React.startTransition.
 *
 * State updates called within the callback receive TransitionLane priority
 * instead of DefaultLane, allowing them to be interrupted by higher-priority
 * updates (user input, flushSync, etc.).
 */
export function startTransition(callback: () => void): void {
  const prevLane = currentUpdateLane;
  const prevPending = isTransitionPending;

  currentUpdateLane = claimNextTransitionLane();
  isTransitionPending = true;

  try {
    callback();
  } finally {
    currentUpdateLane = prevLane;
    isTransitionPending = prevPending;
    flushTransitions();
  }
}

/**
 * Check if we're currently inside a transition.
 */
export function isInTransition(): boolean {
  return isTransitionPending;
}

/**
 * Queue a callback to run at the end of the current transition batch.
 */
export function queueTransitionCallback(callback: () => void): void {
  transitionCallbacks.push(callback);
}

function flushTransitions(): void {
  const callbacks = transitionCallbacks;
  transitionCallbacks = [];
  for (const cb of callbacks) {
    cb();
  }
}
