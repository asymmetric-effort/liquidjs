/**
 * Testing utility that flushes pending updates.
 * Equivalent to React's act().
 */

import { flushPendingTasks } from '../core/scheduler';

export function act(callback: () => void | Promise<void>): void {
  const result = callback();
  flushPendingTasks();

  if (result && typeof (result as Promise<void>).then === 'function') {
    // For async callbacks, we can't fully flush in a synchronous function
    // but we can schedule the flush
    (result as Promise<void>).then(() => {
      flushPendingTasks();
    });
  }
}
