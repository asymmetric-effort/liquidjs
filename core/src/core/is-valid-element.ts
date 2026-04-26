// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import { SPEC_ELEMENT_TYPE, type SpecElement } from '../shared/types';

/**
 * Checks if a value is a valid SpecifyJS element.
 * Equivalent to React.isValidElement.
 */
export function isValidElement(object: unknown): object is SpecElement {
  return (
    typeof object === 'object' &&
    object !== null &&
    (object as SpecElement).$$typeof === SPEC_ELEMENT_TYPE
  );
}
