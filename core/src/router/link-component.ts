/**
 * Link — navigation anchor that updates the hash without page reload.
 */

import { createElement } from '../core/create-element';
import { useContext, useCallback } from '../hooks/index';
import type { LiquidNode } from '../shared/types';
import { RouterContext } from './router-context';
import { matchPath } from './match-path';

export interface LinkProps {
  /** Target path (e.g., '/about') */
  to: string;
  /** CSS class name */
  className?: string;
  /** Additional class when the link's path matches the current route */
  activeClassName?: string;
  /** If true, activeClassName requires exact path match. Default: false. */
  exact?: boolean;
  /** Children (link text/content) */
  children?: LiquidNode;
  /** Additional props passed to the anchor element */
  [key: string]: unknown;
}

export function Link(props: LinkProps): LiquidNode {
  const { to, className, activeClassName, exact, children, ...rest } = props;
  const router = useContext(RouterContext);

  const isActive = matchPath(to, router.pathname, { exact: exact ?? false }) !== null;

  const handleClick = useCallback((e: Event) => {
    e.preventDefault();
    router.navigate(to);
  }, [to, router.navigate]);

  const cls = [className, isActive ? activeClassName : null]
    .filter(Boolean)
    .join(' ') || undefined;

  return createElement('a', {
    ...rest,
    href: '#' + to,
    onClick: handleClick,
    className: cls,
  }, children);
}
