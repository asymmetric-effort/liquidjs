// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

/**
 * Lane-based priority system for concurrent rendering.
 *
 * Lanes are bitmask values representing priority levels. Lower bits = higher
 * priority. Multiple lanes can be active simultaneously. The scheduler uses
 * lanes to determine which work to process first and whether to interrupt
 * lower-priority work for higher-priority updates.
 */

// ---------------------------------------------------------------------------
// Lane constants (bitmask values, lower = higher priority)
// ---------------------------------------------------------------------------

export const NoLane = 0;
export const NoLanes = 0;

/** Synchronous, blocking — used by flushSync */
export const SyncLane = /* .............. */ 0b00000001; // 1

/** Continuous user input — drag, scroll, hover */
export const InputContinuousLane = /* ... */ 0b00000010; // 2

/** Default priority — normal state updates */
export const DefaultLane = /* ........... */ 0b00000100; // 4

/** First transition lane — startTransition */
export const TransitionLane1 = /* ....... */ 0b00001000; // 8

/** Second transition lane — concurrent transitions */
export const TransitionLane2 = /* ....... */ 0b00010000; // 16

/** Retry lane — Suspense retries */
export const RetryLane = /* ............. */ 0b00100000; // 32

/** Idle priority — offscreen/low-priority work */
export const IdleLane = /* .............. */ 0b01000000; // 64

/** Offscreen rendering (future) */
export const OffscreenLane = /* ......... */ 0b10000000; // 128

/** All non-idle lanes */
export const NonIdleLanes =
  SyncLane | InputContinuousLane | DefaultLane | TransitionLane1 | TransitionLane2 | RetryLane;

// ---------------------------------------------------------------------------
// Lane utilities
// ---------------------------------------------------------------------------

/** Combine two lane sets. */
export function mergeLanes(a: number, b: number): number {
  return a | b;
}

/** Check if `subset` is entirely contained within `set`. */
export function isSubsetOfLanes(set: number, subset: number): boolean {
  return (set & subset) === subset;
}

/** Check if `a` and `b` share any lanes. */
export function includesSomeLane(a: number, b: number): boolean {
  return (a & b) !== NoLanes;
}

/** Remove `subset` lanes from `set`. */
export function removeLanes(set: number, subset: number): number {
  return set & ~subset;
}

/**
 * Isolate the highest-priority (lowest-bit) lane from a lane set.
 * Uses the two's complement trick: `lanes & -lanes` isolates the rightmost set bit.
 */
export function getHighestPriorityLane(lanes: number): number {
  return lanes & -lanes;
}

/** Check if a lane set is empty. */
export function isEmpty(lanes: number): boolean {
  return lanes === NoLanes;
}

// ---------------------------------------------------------------------------
// Lane expiration — starvation prevention
// ---------------------------------------------------------------------------

/** Timeout in ms before a pending lane is promoted to SyncLane. -1 = never. */
export function laneExpirationMs(lane: number): number {
  switch (lane) {
    case SyncLane:
    case InputContinuousLane:
      return -1; // Already highest priority
    case DefaultLane:
      return 5000;
    case TransitionLane1:
    case TransitionLane2:
      return 5000;
    case RetryLane:
      return 5000;
    case IdleLane:
    case OffscreenLane:
      return -1; // Never expire — only run when idle
    default:
      return -1;
  }
}

/**
 * Pick the next transition lane. Alternates between TransitionLane1 and
 * TransitionLane2 to allow two concurrent transitions.
 */
let nextTransitionLane: number = TransitionLane1;

export function claimNextTransitionLane(): number {
  const lane = nextTransitionLane;
  nextTransitionLane = lane === TransitionLane1 ? TransitionLane2 : TransitionLane1;
  return lane;
}
