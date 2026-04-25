// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

/**
 * External store for hash-based routing state.
 * Compatible with useSyncExternalStore for tear-free reads.
 */

export interface RouterSnapshot {
  /** Hash path without '#', e.g., '/users/123' */
  pathname: string;
  /** Full hash string, e.g., '#/users/123' */
  hash: string;
}

function getHashPath(): string {
  /* v8 ignore next */
  const hash = typeof window !== 'undefined' ? window.location.hash : '';
  const path = hash.replace(/^#\/?/, '/');
  return path === '' ? '/' : path;
}

let currentSnapshot: RouterSnapshot = {
  pathname: getHashPath(),
  /* v8 ignore next */
  hash: typeof window !== 'undefined' ? window.location.hash : '',
};

const listeners = new Set<() => void>();

/** Force-refresh the snapshot from the current hash. For testing. */
export function __resetSnapshot(): void {
  currentSnapshot = {
    pathname: getHashPath(),
    /* v8 ignore next */
    hash: typeof window !== 'undefined' ? window.location.hash : '',
  };
}

function emitChange(): void {
  currentSnapshot = {
    pathname: getHashPath(),
    /* v8 ignore next */
    hash: typeof window !== 'undefined' ? window.location.hash : '',
  };
  for (const listener of listeners) {
    listener();
  }
}

// Listen to hashchange events
/* v8 ignore next 3 */
if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', emitChange);
}

/** Subscribe to hash changes. Returns unsubscribe function. */
export function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

/** Get the current router snapshot. */
export function getSnapshot(): RouterSnapshot {
  return currentSnapshot;
}

/** Server-side snapshot (always root). */
export function getServerSnapshot(): RouterSnapshot {
  return { pathname: '/', hash: '' };
}

/** Navigate to a new hash path. */
export function navigate(to: string, options?: { replace?: boolean }): void {
  const hashPath = to.startsWith('#') ? to : '#' + to;

  if (options?.replace) {
    const url = window.location.pathname + window.location.search + hashPath;
    window.history.replaceState(null, '', url);
  } else {
    window.location.hash = hashPath;
  }

  // Always emit synchronously so subscribers are notified immediately.
  // The hashchange event may fire asynchronously, but we need immediate
  // notification for synchronous rendering.
  emitChange();
}
