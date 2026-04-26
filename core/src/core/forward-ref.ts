// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import { SPEC_FORWARD_REF_TYPE, type Props, type Ref, type SpecNode } from '../shared/types';

export interface ForwardRefRenderFunction<T, P extends Props = Props> {
  (props: P, ref: Ref<T>): SpecNode;
  displayName?: string;
}

export interface ForwardRefComponent<T, P extends Props = Props> {
  $$typeof: typeof SPEC_FORWARD_REF_TYPE;
  render: ForwardRefRenderFunction<T, P>;
  displayName?: string;
}

/**
 * Forwards a ref through a component to a child.
 * Equivalent to React.forwardRef.
 */
export function forwardRef<T, P extends Props = Props>(
  render: ForwardRefRenderFunction<T, P>,
): ForwardRefComponent<T, P> {
  return {
    $$typeof: SPEC_FORWARD_REF_TYPE,
    render,
    displayName: render.displayName || render.name || 'ForwardRef',
  };
}
