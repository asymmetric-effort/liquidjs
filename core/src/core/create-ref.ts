// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import type { RefObject } from '../shared/types';

/**
 * Creates a ref object with a mutable .current property.
 * Equivalent to React.createRef.
 */
export function createRef<T = unknown>(): RefObject<T> {
  return { current: null };
}
