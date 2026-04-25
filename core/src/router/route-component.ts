/**
 * Route — conditionally renders content when the current path matches.
 */

import { createElement } from '../core/create-element';
import { useContext, useMemo } from '../hooks/index';
import type { LiquidNode, FunctionComponent } from '../shared/types';
import { RouterContext, type RouterContextValue } from './router-context';
import { matchPath } from './match-path';

export interface RouteProps {
  /** Path pattern to match (e.g., '/users/:id') */
  path: string;
  /** Component to render when matched. Receives route params as props. */
  component?: FunctionComponent;
  /** If true, path must match the entire pathname. Default: false. */
  exact?: boolean;
  /** Children to render when matched (alternative to component). */
  children?: LiquidNode;
}

export function Route(props: RouteProps): LiquidNode {
  const router = useContext(RouterContext);
  const fullPattern = router.basePath + props.path;
  const match = matchPath(fullPattern, router.pathname, {
    exact: props.exact ?? false,
  });

  // useMemo must be called unconditionally (rules of hooks)
  const nestedValue: RouterContextValue = useMemo(
    () => ({
      pathname: router.pathname,
      params: {
        ...router.params,
        ...(match ? match.params : {}),
      },
      navigate: router.navigate,
      basePath: match ? match.url : router.basePath,
    }),
    [router.pathname, router.navigate, router.params, router.basePath, match],
  );

  if (!match) return null;

  // Merge parent params
  for (const key of Object.keys(router.params)) {
    if (!(key in nestedValue.params)) {
      nestedValue.params[key] = router.params[key]!;
    }
  }

  const content = props.component
    ? createElement(props.component, { ...nestedValue.params })
    : props.children;

  return createElement(RouterContext.Provider, { value: nestedValue }, content);
}
