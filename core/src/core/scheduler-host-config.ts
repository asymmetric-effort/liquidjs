/**
 * Host scheduling configuration for concurrent rendering.
 *
 * Abstracts the platform-specific scheduling primitives behind a swappable
 * interface. In browsers, uses MessageChannel for macrotask scheduling with
 * a 5ms frame budget. In tests, can be replaced with a controllable mock.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SchedulerCallback {
  (): SchedulerCallback | null;
}

export interface CallbackNode {
  callback: SchedulerCallback | null;
  cancelled: boolean;
}

// ---------------------------------------------------------------------------
// Time
// ---------------------------------------------------------------------------

export function getCurrentTime(): number {
  return typeof performance !== 'undefined' && typeof performance.now === 'function'
    ? performance.now()
    : /* v8 ignore next */ Date.now();
}

// ---------------------------------------------------------------------------
// Frame budget — 5ms per work slice (matches React)
// ---------------------------------------------------------------------------

const FRAME_YIELD_MS = 5;
let deadline = 0;

export function shouldYieldToHost(): boolean {
  return getCurrentTime() >= deadline;
}

export function resetDeadline(): void {
  deadline = getCurrentTime() + FRAME_YIELD_MS;
}

// ---------------------------------------------------------------------------
// Callback scheduling via MessageChannel
// ---------------------------------------------------------------------------

let scheduledCallback: SchedulerCallback | null = null;
let isMessageLoopRunning = false;

function performWorkUntilDeadline(): void {
  if (scheduledCallback !== null) {
    resetDeadline();
    const cb = scheduledCallback;
    let hasMoreWork = false;
    try {
      const continuation = cb();
      if (typeof continuation === 'function') {
        scheduledCallback = continuation;
        hasMoreWork = true;
      } else {
        scheduledCallback = null;
      }
    /* v8 ignore next 4 */
    } catch (err) {
      scheduledCallback = null;
      isMessageLoopRunning = false;
      throw err;
    }
    if (hasMoreWork) {
      schedulePerformWorkUntilDeadline();
    } else {
      isMessageLoopRunning = false;
    }
  } else {
    isMessageLoopRunning = false;
  }
}

// Set up the MessageChannel for scheduling.
// In environments without MessageChannel (unlikely), fall back to setTimeout.
let schedulePerformWorkUntilDeadline: () => void;

if (typeof MessageChannel !== 'undefined') {
  const channel = new MessageChannel();
  channel.port1.onmessage = performWorkUntilDeadline;
  schedulePerformWorkUntilDeadline = () => {
    channel.port2.postMessage(null);
  };
/* v8 ignore next 5 */
} else {
  schedulePerformWorkUntilDeadline = () => {
    setTimeout(performWorkUntilDeadline, 0);
  };
}

/**
 * Schedule a callback to run asynchronously. Returns a handle for cancellation.
 * If the callback returns another function, that function is scheduled as a
 * continuation (the work was interrupted and needs to resume).
 */
export function scheduleCallback(callback: SchedulerCallback): CallbackNode {
  const node: CallbackNode = { callback, cancelled: false };
  scheduledCallback = callback;

  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;
    schedulePerformWorkUntilDeadline();
  }

  return node;
}

/**
 * Cancel a previously scheduled callback.
 */
export function cancelCallback(node: CallbackNode): void {
  node.cancelled = true;
  // If this was the active callback, clear it
  if (node.callback === scheduledCallback) {
    scheduledCallback = null;
  }
}

// ---------------------------------------------------------------------------
// Testing utilities
// ---------------------------------------------------------------------------

/**
 * Synchronously flush all pending scheduled work.
 * Only use in tests — in production, work is scheduled asynchronously.
 */
export function flushAllWork(): void {
  while (scheduledCallback !== null) {
    resetDeadline();
    const cb = scheduledCallback;
    const continuation = cb();
    if (typeof continuation === 'function') {
      scheduledCallback = continuation;
    } else {
      scheduledCallback = null;
    }
  }
  isMessageLoopRunning = false;
}

/**
 * Check if there is pending scheduled work.
 */
export function hasPendingWork(): boolean {
  return scheduledCallback !== null;
}
