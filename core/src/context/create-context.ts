// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import {
  SPEC_PROVIDER_TYPE,
  SPEC_CONSUMER_TYPE,
  type SpecContext,
  type ComponentType,
} from '../shared/types';

export interface ContextProvider<T> {
  $$typeof: typeof SPEC_PROVIDER_TYPE;
  _context: SpecContext<T>;
}

export interface ContextConsumer<T> {
  $$typeof: typeof SPEC_CONSUMER_TYPE;
  _context: SpecContext<T>;
}

/**
 * Creates a context object with Provider and Consumer.
 * Equivalent to React.createContext.
 */
export function createContext<T>(defaultValue: T): SpecContext<T> {
  const context: SpecContext<T> = {
    $$typeof: Symbol.for('spec.context'),
    Provider: null as unknown as ComponentType,
    Consumer: null as unknown as ComponentType,
    _currentValue: defaultValue,
    _defaultValue: defaultValue,
  };

  const provider: ContextProvider<T> = {
    $$typeof: SPEC_PROVIDER_TYPE,
    _context: context,
  };

  const consumer: ContextConsumer<T> = {
    $$typeof: SPEC_CONSUMER_TYPE,
    _context: context,
  };

  context.Provider = provider as unknown as ComponentType;
  context.Consumer = consumer as unknown as ComponentType;

  return context;
}
