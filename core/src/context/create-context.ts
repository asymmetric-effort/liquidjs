// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import {
  LIQUID_PROVIDER_TYPE,
  LIQUID_CONSUMER_TYPE,
  type LiquidContext,
  type ComponentType,
} from '../shared/types';

export interface ContextProvider<T> {
  $$typeof: typeof LIQUID_PROVIDER_TYPE;
  _context: LiquidContext<T>;
}

export interface ContextConsumer<T> {
  $$typeof: typeof LIQUID_CONSUMER_TYPE;
  _context: LiquidContext<T>;
}

/**
 * Creates a context object with Provider and Consumer.
 * Equivalent to React.createContext.
 */
export function createContext<T>(defaultValue: T): LiquidContext<T> {
  const context: LiquidContext<T> = {
    $$typeof: Symbol.for('liquid.context'),
    Provider: null as unknown as ComponentType,
    Consumer: null as unknown as ComponentType,
    _currentValue: defaultValue,
    _defaultValue: defaultValue,
  };

  const provider: ContextProvider<T> = {
    $$typeof: LIQUID_PROVIDER_TYPE,
    _context: context,
  };

  const consumer: ContextConsumer<T> = {
    $$typeof: LIQUID_CONSUMER_TYPE,
    _context: context,
  };

  context.Provider = provider as unknown as ComponentType;
  context.Consumer = consumer as unknown as ComponentType;

  return context;
}
