// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import type { SpecNode, SpecChild, SpecElement } from '../shared/types';
import { isValidElement } from './is-valid-element';

/**
 * Utilities for working with the children prop.
 * Equivalent to React.Children.
 */

function flattenChildren(children: SpecNode): SpecChild[] {
  const result: SpecChild[] = [];
  const stack: SpecNode[] = [children];

  while (stack.length > 0) {
    const node = stack.pop()!;
    if (Array.isArray(node)) {
      for (let i = node.length - 1; i >= 0; i--) {
        stack.push(node[i] as SpecNode);
      }
    } else {
      result.push(node as SpecChild);
    }
  }

  return result;
}

function mapChildren(
  children: SpecNode,
  fn: (child: SpecChild, index: number) => SpecChild,
): SpecChild[] {
  const flat = flattenChildren(children);
  const result: SpecChild[] = [];

  for (let i = 0; i < flat.length; i++) {
    const child = flat[i];
    if (child == null || typeof child === 'boolean') {
      continue;
    }
    result.push(fn(child, i));
  }

  return result;
}

function forEachChildren(children: SpecNode, fn: (child: SpecChild, index: number) => void): void {
  const flat = flattenChildren(children);
  let index = 0;

  for (const child of flat) {
    if (child == null || typeof child === 'boolean') {
      continue;
    }
    fn(child, index++);
  }
}

function countChildren(children: SpecNode): number {
  const flat = flattenChildren(children);
  let count = 0;

  for (const child of flat) {
    if (child != null && typeof child !== 'boolean') {
      count++;
    }
  }

  return count;
}

function onlyChild(children: SpecNode): SpecElement {
  if (!isValidElement(children)) {
    throw new Error('Children.only: expected a single SpecifyJS element child');
  }
  return children as SpecElement;
}

function toArray(children: SpecNode): SpecChild[] {
  const flat = flattenChildren(children);
  return flat.filter((child) => child != null && typeof child !== 'boolean');
}

export const Children = {
  map: mapChildren,
  forEach: forEachChildren,
  count: countChildren,
  only: onlyChild,
  toArray,
};
