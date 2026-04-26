// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import {
  SPEC_PORTAL_TYPE,
  SPEC_ELEMENT_TYPE,
  type SpecElement,
  type SpecNode,
  type Props,
  type Key,
} from '../shared/types';

/**
 * Creates a portal to render children into a different DOM subtree.
 * Equivalent to ReactDOM.createPortal.
 */
export function createPortal(children: SpecNode, container: Element, key?: Key): SpecElement {
  return {
    $$typeof: SPEC_ELEMENT_TYPE,
    type: SPEC_PORTAL_TYPE as unknown as symbol,
    props: { children, container } as unknown as Props,
    key: key ?? null,
    ref: null,
  };
}
