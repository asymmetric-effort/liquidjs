// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import type { SpecNode } from '../shared/types';
import { createRoot, hydrateRoot, type Root } from './create-root';

const containerRootMap = new WeakMap<Element, Root>();

/**
 * Legacy render API.
 * Equivalent to ReactDOM.render (pre-React 18).
 */
export function render(element: SpecNode, container: Element, callback?: () => void): void {
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
export function hydrate(element: SpecNode, container: Element, callback?: () => void): void {
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
