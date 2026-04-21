import type { LiquidNode } from '../shared/types';
import { createRoot, hydrateRoot, type Root } from './create-root';

const containerRootMap = new WeakMap<Element, Root>();

/**
 * Legacy render API.
 * Equivalent to ReactDOM.render (pre-React 18).
 */
export function render(element: LiquidNode, container: Element, callback?: () => void): void {
  let root = containerRootMap.get(container);

  if (!root) {
    root = createRoot(container);
    containerRootMap.set(container, root);
  }

  root.render(element);

  if (callback) {
    // Execute callback after render commits
    Promise.resolve().then(callback);
  }
}

/**
 * Legacy hydrate API.
 * Equivalent to ReactDOM.hydrate (pre-React 18).
 */
export function hydrate(element: LiquidNode, container: Element, callback?: () => void): void {
  const root = hydrateRoot(container, element);
  containerRootMap.set(container, root);

  if (callback) {
    Promise.resolve().then(callback);
  }
}

/**
 * Legacy unmount API.
 * Equivalent to ReactDOM.unmountComponentAtNode.
 */
export function unmountComponentAtNode(container: Element): boolean {
  const root = containerRootMap.get(container);

  if (root) {
    root.unmount();
    containerRootMap.delete(container);
    return true;
  }

  return false;
}
