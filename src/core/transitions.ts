/**
 * Marks a state update as a transition (non-urgent).
 * Equivalent to React.startTransition.
 */
export function startTransition(callback: () => void): void {
  // TODO: integrate with scheduler priority lanes
  callback();
}
