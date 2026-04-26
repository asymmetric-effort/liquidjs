// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import type { SpecNode } from '../shared/types';
import { createFiberRoot, performSyncWork, fiberRoots } from './work-loop';

export interface Root {
  render(children: SpecNode): void;
  unmount(): void;
}

export interface RootOptions {
  onRecoverableError?: (error: unknown) => void;
  identifierPrefix?: string;
}

/**
 * Creates a concurrent root for rendering.
 * Equivalent to ReactDOM.createRoot.
 */
export function createRoot(container: Element | DocumentFragment, _options?: RootOptions): Root {
  if (!container || (!(container instanceof Element) && !(container instanceof DocumentFragment))) {
    throw new Error('createRoot: container must be a DOM element or DocumentFragment');
  }

  const fiberRoot = createFiberRoot(container);
  fiberRoots.set(container, fiberRoot);

  let isMounted = false;

  return {
    render(children: SpecNode): void {
      isMounted = true;
      performSyncWork(fiberRoot, children);
    },
    unmount(): void {
      if (!isMounted) return;
      isMounted = false;
      performSyncWork(fiberRoot, null);
      fiberRoots.delete(container);
    },
  };
}

/**
 * Creates a root for hydrating server-rendered content.
 * Equivalent to ReactDOM.hydrateRoot.
 *
 * Unlike createRoot, this preserves the existing DOM in the container and
 * attempts to reuse DOM nodes during the initial render. Event listeners
 * and component state are attached to the existing DOM structure.
 */
export function hydrateRoot(
  container: Element | Document,
  initialChildren: SpecNode,
  _options?: RootOptions,
): Root {
  if (!container) {
    throw new Error('hydrateRoot: container must be a DOM element');
  }

  const elem = container as Element;
  const fiberRoot = createFiberRoot(elem);
  fiberRoot.isHydrating = true; // Enable hydration mode for initial render
  fiberRoots.set(elem, fiberRoot);

  let isMounted = false;

  const root: Root = {
    render(children: SpecNode): void {
      isMounted = true;
      performSyncWork(fiberRoot, children);
    },
    unmount(): void {
      if (!isMounted) return;
      isMounted = false;
      performSyncWork(fiberRoot, null);
      fiberRoots.delete(elem);
    },
  };

  // Perform the initial hydrating render
  root.render(initialChildren);
  return root;
}
