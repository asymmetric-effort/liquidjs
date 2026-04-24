/**
 * Minimal scheduler for batching updates and scheduling work.
 * This is the internal engine that drives re-renders.
 */

type Task = () => void;

let isBatchingUpdates = false;
let pendingTasks: Task[] = [];

/**
 * Schedule a task. If inside a batch, it's deferred.
 * Otherwise it runs synchronously (or via microtask).
 */
export function scheduleUpdate(task: Task): void {
  if (isBatchingUpdates) {
    pendingTasks.push(task);
    return;
  }
  task();
}

/**
 * Run a callback inside a batch — all updates are deferred
 * until the batch completes.
 */
export function batchUpdates<T>(fn: () => T): T {
  const prevBatching = isBatchingUpdates;
  isBatchingUpdates = true;
  try {
    return fn();
  } finally {
    isBatchingUpdates = prevBatching;
    if (!isBatchingUpdates) {
      flushPendingTasks();
    }
  }
}

/**
 * Flush all pending tasks synchronously.
 */
export function flushPendingTasks(): void {
  const tasks = pendingTasks;
  pendingTasks = [];
  for (const task of tasks) {
    task();
  }
}

/**
 * Schedule work via microtask for async batching.
 */
export function scheduleMicrotask(fn: () => void): void {
  if (typeof queueMicrotask === 'function') {
    queueMicrotask(fn);
  } else {
    /* v8 ignore next -- Promise fallback for environments without queueMicrotask */
    Promise.resolve().then(fn);
  }
}

/**
 * Check if we're currently batching.
 */
export function isBatching(): boolean {
  return isBatchingUpdates;
}
