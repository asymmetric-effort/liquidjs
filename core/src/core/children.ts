// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import type { LiquidNode, LiquidChild, LiquidElement } from '../shared/types';
import { isValidElement } from './is-valid-element';

/**
 * Utilities for working with the children prop.
 * Equivalent to React.Children.
 */

function flattenChildren(children: LiquidNode): LiquidChild[] {
  const result: LiquidChild[] = [];

  if (Array.isArray(children)) {
    for (const child of children) {
      if (Array.isArray(child)) {
        result.push(...flattenChildren(child));
      } else {
        result.push(child as LiquidChild);
      }
    }
  } else {
    result.push(children as LiquidChild);
  }

  return result;
}

function mapChildren(
  children: LiquidNode,
  fn: (child: LiquidChild, index: number) => LiquidChild,
): LiquidChild[] {
  const flat = flattenChildren(children);
  const result: LiquidChild[] = [];

  for (let i = 0; i < flat.length; i++) {
    const child = flat[i];
    if (child == null || typeof child === 'boolean') {
      continue;
    }
    result.push(fn(child, i));
  }

  return result;
}

function forEachChildren(
  children: LiquidNode,
  fn: (child: LiquidChild, index: number) => void,
): void {
  const flat = flattenChildren(children);
  let index = 0;

  for (const child of flat) {
    if (child == null || typeof child === 'boolean') {
      continue;
    }
    fn(child, index++);
  }
}

function countChildren(children: LiquidNode): number {
  const flat = flattenChildren(children);
  let count = 0;

  for (const child of flat) {
    if (child != null && typeof child !== 'boolean') {
      count++;
    }
  }

  return count;
}

function onlyChild(children: LiquidNode): LiquidElement {
  if (!isValidElement(children)) {
    throw new Error('Children.only: expected a single LiquidJS element child');
  }
  return children as LiquidElement;
}

function toArray(children: LiquidNode): LiquidChild[] {
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
