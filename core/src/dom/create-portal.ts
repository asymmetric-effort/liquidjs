// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import {
  LIQUID_PORTAL_TYPE,
  LIQUID_ELEMENT_TYPE,
  type LiquidElement,
  type LiquidNode,
  type Props,
  type Key,
} from '../shared/types';

/**
 * Creates a portal to render children into a different DOM subtree.
 * Equivalent to ReactDOM.createPortal.
 */
export function createPortal(children: LiquidNode, container: Element, key?: Key): LiquidElement {
  return {
    $$typeof: LIQUID_ELEMENT_TYPE,
    type: LIQUID_PORTAL_TYPE as unknown as symbol,
    props: { children, container } as unknown as Props,
    key: key ?? null,
    ref: null,
  };
}
