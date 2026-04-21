// ============================================================================
// LiquidJS JSX Runtime (automatic transform)
// ============================================================================

import { createElement } from './core/create-element';
import { Fragment } from './core/fragment';
import type { Props, Key, ComponentType, LiquidElement } from './shared/types';

export { Fragment };

export function jsx<P extends Props>(
  type: ComponentType<P>,
  config: P & { key?: Key },
  maybeKey?: Key,
): LiquidElement<P> {
  const key = maybeKey !== undefined ? maybeKey : config.key !== undefined ? config.key : null;
  const { key: _key, ...props } = config;
  return createElement(type, { ...props, key } as unknown as P);
}

export { jsx as jsxs };
