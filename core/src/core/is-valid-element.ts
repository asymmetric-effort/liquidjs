// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import { LIQUID_ELEMENT_TYPE, type LiquidElement } from '../shared/types';

/**
 * Checks if a value is a valid SpecifyJS element.
 * Equivalent to React.isValidElement.
 */
export function isValidElement(object: unknown): object is LiquidElement {
  return (
    typeof object === 'object' &&
    object !== null &&
    (object as LiquidElement).$$typeof === LIQUID_ELEMENT_TYPE
  );
}
