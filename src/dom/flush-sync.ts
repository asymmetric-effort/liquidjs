/**
 * Forces synchronous flushing of pending state updates.
 * Equivalent to ReactDOM.flushSync.
 */
export function flushSync<T>(fn: () => T): T {
  // TODO: integrate with scheduler to bypass batching
  return fn();
}
