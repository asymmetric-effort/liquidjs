// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import { createElement, FeatureGate, useFeatureFlags } from 'liquidjs';
import { Link } from 'liquidjs';
import { useState } from 'liquidjs/hooks';

function DropletLogo() {
  return createElement(
    'svg',
    {
      width: '22',
      height: '22',
      viewBox: '0 0 64 64',
      style: { flexShrink: '0' },
    },
    createElement('path', {
      d: 'M32 4 C32 4, 12 28, 12 40 C12 51.05 20.95 60 32 60 C43.05 60 52 51.05 52 40 C52 28, 32 4, 32 4 Z',
      fill: '#3b82f6',
    }),
    createElement('ellipse', {
      cx: '24',
      cy: '36',
      rx: '6',
      ry: '8',
      fill: '#60a5fa',
      opacity: '0.5',
      transform: 'rotate(-15 24 36)',
    }),
    createElement(
      'defs',
      null,
      createElement(
        'clipPath',
        { id: 'drop-clip' },
        createElement('path', {
          d: 'M32 4 C32 4, 12 28, 12 40 C12 51.05 20.95 60 32 60 C43.05 60 52 51.05 52 40 C52 28, 32 4, 32 4 Z',
        }),
      ),
    ),
    createElement(
      'g',
      { 'clip-path': 'url(#drop-clip)' },
      createElement('rect', {
        x: '-10',
        y: '24',
        width: '84',
        height: '8',
        fill: '#f59e0b',
        transform: 'rotate(-45 32 32)',
        rx: '1',
      }),
    ),
  );
}

function DarkModeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.getAttribute('data-theme') === 'dark');

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
  };

  return createElement(
    'button',
    {
      className: 'dark-mode-toggle',
      onClick: toggle,
      title: dark ? 'Switch to light mode' : 'Switch to dark mode',
    },
    dark ? '\u2600\ufe0f' : '\ud83c\udf19',
  );
}

const navItems: { to: string; label: string; flag?: string; exact?: boolean }[] = [
  { to: '/', label: 'Home', exact: true },
  { to: '/components', label: 'Components' },
  { to: '/dashboard', label: 'Dashboard', flag: 'dashboard' },
  { to: '/concurrent', label: 'Concurrent', flag: 'concurrent-rendering' },
  { to: '/api', label: 'API' },
  { to: '/reference', label: 'Reference', flag: 'component-reference' },
  { to: '/getting-started', label: 'Get Started', flag: 'getting-started' },
  { to: '/featureflags', label: 'Flags', flag: 'feature-flags-demo' },
];

function GatedNavLinks() {
  const { isEnabled } = useFeatureFlags();
  return createElement(
    'div',
    { className: 'nav-links' },
    ...navItems
      .filter((item) => !item.flag || isEnabled(item.flag))
      .map((item) =>
        createElement(
          Link,
          { to: item.to, className: 'nav-link', activeClassName: 'active', exact: item.exact },
          item.label,
        ),
      ),
  );
}

export function NavBar() {
  return createElement(
    'nav',
    { className: 'nav-bar' },
    createElement(
      'div',
      { className: 'nav-bar-inner' },
      createElement(
        Link,
        { to: '/', className: 'nav-logo', exact: true },
        createElement(DropletLogo, null),
        'LiquidJS',
      ),
      createElement(GatedNavLinks, null),
      createElement(FeatureGate, { flag: 'dark-mode', fallback: null },
        createElement(DarkModeToggle, null),
      ),
    ),
  );
}
