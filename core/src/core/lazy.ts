// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import { SPEC_LAZY_TYPE, type Props, type ComponentType } from '../shared/types';

type LazyStatus = 'pending' | 'resolved' | 'rejected';

export interface LazyComponent<P extends Props = Props> {
  $$typeof: typeof SPEC_LAZY_TYPE;
  _payload: {
    _status: LazyStatus;
    _result: ComponentType<P> | unknown;
  };
  _init: () => ComponentType<P>;
  displayName?: string;
}

/**
 * Lazily loads a component. Must be used with Suspense.
 * Equivalent to React.lazy.
 */
export function lazy<P extends Props>(
  factory: () => Promise<{ default: ComponentType<P> }>,
): LazyComponent<P> {
  const payload: LazyComponent<P>['_payload'] = {
    _status: 'pending',
    _result: undefined,
  };

  const init = (): ComponentType<P> => {
    if (payload._status === 'resolved') {
      return payload._result as ComponentType<P>;
    }
    if (payload._status === 'rejected') {
      throw payload._result;
    }

    const promise = factory();
    payload._status = 'pending';

    promise.then(
      (module) => {
        payload._status = 'resolved';
        payload._result = module.default;
      },
      (error) => {
        payload._status = 'rejected';
        payload._result = error;
      },
    );

    throw promise;
  };

  return {
    $$typeof: SPEC_LAZY_TYPE,
    _payload: payload,
    _init: init,
    displayName: 'Lazy',
  };
}
