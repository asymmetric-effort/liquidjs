// ============================================================================
// LiquidJS JSX Runtime (automatic transform)
// ============================================================================
// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

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
  const configWithKey = key !== null ? { ...props, key } : props;
  return createElement(type, configWithKey as unknown as P);
}

export { jsx as jsxs };
