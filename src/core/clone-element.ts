import { LIQUID_ELEMENT_TYPE, type LiquidElement, type Props, type Key, type Ref, type LiquidNode } from '../shared/types';
import { isValidElement } from './is-valid-element';

/**
 * Clones a LiquidJS element with new props merged in.
 * Equivalent to React.cloneElement.
 */
export function cloneElement<P extends Props>(
  element: LiquidElement<P>,
  config?: Partial<P> & { key?: Key; ref?: Ref },
  ...children: LiquidNode[]
): LiquidElement<P> {
  if (!isValidElement(element)) {
    throw new Error('cloneElement: argument must be a valid LiquidJS element');
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
        propName !== 'ref'
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
    $$typeof: LIQUID_ELEMENT_TYPE,
    type: element.type,
    props: props as P,
    key,
    ref,
  };
}
