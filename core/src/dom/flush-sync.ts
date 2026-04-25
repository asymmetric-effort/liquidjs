// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

/**
 * Forces synchronous flushing of pending state updates.
 * Equivalent to ReactDOM.flushSync.
 *
 * Any state updates triggered within the callback receive SyncLane priority
 * and are flushed before flushSync returns.
 */

import { enterFlushSyncContext, exitFlushSyncContext } from '../core/transitions';
import { flushPendingTasks } from '../core/scheduler';

export function flushSync<T>(fn: () => T): T {
  enterFlushSyncContext();
  try {
    const result = fn();
    // Flush any sync-priority work that was scheduled
    flushPendingTasks();
    return result;
  } finally {
    exitFlushSyncContext();
  }
}
