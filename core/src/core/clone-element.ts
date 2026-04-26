// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import {
  SPEC_ELEMENT_TYPE,
  type SpecElement,
  type Props,
  type Key,
  type Ref,
  type SpecNode,
} from '../shared/types';
import { isValidElement } from './is-valid-element';

/**
 * Clones a SpecifyJS element with new props merged in.
 * Equivalent to React.cloneElement.
 */
export function cloneElement<P extends Props>(
  element: SpecElement<P>,
  config?: Partial<P> & { key?: Key; ref?: Ref },
  ...children: SpecNode[]
): SpecElement<P> {
  if (!isValidElement(element)) {
    throw new Error('cloneElement: argument must be a valid SpecifyJS element');
  }

  let key: Key = element.key;
  let ref: Ref = element.ref;
  const props: Record<string, unknown> = { ...element.props };

  if (config != null) {
    if (config.key !== undefined) {
      key = '' + config.key;
    }
    if (config.ref !== undefined) {
      ref = config.ref as Ref;
    }

    for (const propName in config) {
      if (
        Object.prototype.hasOwnProperty.call(config, propName) &&
        propName !== 'key' &&
        propName !== 'ref' &&
        propName !== '__proto__' &&
        propName !== 'constructor' &&
        propName !== 'prototype'
      ) {
        props[propName] = (config as Record<string, unknown>)[propName];
      }
    }
  }

  if (children.length === 1) {
    props.children = children[0];
  } else if (children.length > 1) {
    props.children = children;
  }

  return {
    $$typeof: SPEC_ELEMENT_TYPE,
    type: element.type,
    props: props as P,
    key,
    ref,
  };
}
