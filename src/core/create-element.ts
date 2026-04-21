import {
  LIQUID_ELEMENT_TYPE,
  type LiquidElement,
  type ComponentType,
  type Props,
  type Key,
  type Ref,
  type LiquidNode,
} from '../shared/types';

/**
 * Creates a LiquidJS element (virtual DOM node).
 * Equivalent to React.createElement.
 */
export function createElement<P extends Props>(
  type: ComponentType<P>,
  config: (Omit<P, 'children'> & { key?: Key; ref?: Ref }) | null,
  ...children: LiquidNode[]
): LiquidElement<P> {
  let key: Key = null;
  let ref: Ref = null;
  const props: Record<string, unknown> = {};

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

  // Apply default props for component types
  if (typeof type === 'function' && (type as unknown as { defaultProps?: Partial<P> }).defaultProps) {
    const defaultProps = (type as unknown as { defaultProps: Partial<P> }).defaultProps;
    for (const propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  return {
    $$typeof: LIQUID_ELEMENT_TYPE,
    type,
    props: props as P,
    key,
    ref,
  };
}
