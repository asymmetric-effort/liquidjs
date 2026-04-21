/**
 * Transition system for marking non-urgent updates.
 */

let isTransitionPending = false;
let transitionCallbacks: (() => void)[] = [];

/**
 * Marks a state update as a transition (non-urgent).
 * Equivalent to React.startTransition.
 */
export function startTransition(callback: () => void): void {
  const prevPending = isTransitionPending;
  isTransitionPending = true;
  try {
    callback();
  } finally {
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
