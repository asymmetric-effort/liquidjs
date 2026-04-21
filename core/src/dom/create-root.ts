import type { LiquidNode } from '../shared/types';
import { createFiberRoot, performSyncWork, fiberRoots } from './work-loop';

export interface Root {
  render(children: LiquidNode): void;
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
    render(children: LiquidNode): void {
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
 */
export function hydrateRoot(
  container: Element | Document,
  initialChildren: LiquidNode,
  _options?: RootOptions,
): Root {
  if (!container) {
    throw new Error('hydrateRoot: container must be a DOM element');
  }

  const root = createRoot(container as Element, _options);
  root.render(initialChildren);
  return root;
}
