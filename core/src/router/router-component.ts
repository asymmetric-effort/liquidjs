// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

/**
 * Router — top-level component that subscribes to hash changes
 * and provides routing context to descendants.
 */

import { createElement } from '../core/create-element';
import { useState, useEffect, useCallback, useMemo } from '../hooks/index';
import type { SpecNode } from '../shared/types';
import { RouterContext, type RouterContextValue } from './router-context';
import { subscribe, getSnapshot, navigate } from './router-store';

export interface RouterProps {
  children?: SpecNode;
}

export function Router(props: RouterProps): SpecNode {
  const [pathname, setPathname] = useState(() => getSnapshot().pathname);

  useEffect(() => {
    // Sync with current hash on mount
    setPathname(getSnapshot().pathname);

    const unsubscribe = subscribe(() => {
      setPathname(getSnapshot().pathname);
    });

    return unsubscribe;
  }, []);

  const nav = useCallback((...args: unknown[]) => {
    navigate(args[0] as string, args[1] as { replace?: boolean } | undefined);
  }, []) as unknown as (to: string, options?: { replace?: boolean }) => void;

  const value: RouterContextValue = useMemo(
    () => ({
      pathname,
      params: {},
      navigate: nav,
      basePath: '',
    }),
    [pathname, nav],
  );

  return createElement(RouterContext.Provider, { value }, props.children);
}
