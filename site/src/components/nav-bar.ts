// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import { createElement } from 'liquidjs';
import { Link } from 'liquidjs';

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
      createElement(
        'div',
        { className: 'nav-links' },
        createElement(Link, { to: '/', className: 'nav-link', activeClassName: 'active', exact: true }, 'Home'),
        createElement(Link, { to: '/components', className: 'nav-link', activeClassName: 'active' }, 'Components'),
        createElement(Link, { to: '/dashboard', className: 'nav-link', activeClassName: 'active' }, 'Dashboard'),
        createElement(Link, { to: '/concurrent', className: 'nav-link', activeClassName: 'active' }, 'Concurrent'),
        createElement(Link, { to: '/api', className: 'nav-link', activeClassName: 'active' }, 'API'),
        createElement(Link, { to: '/reference', className: 'nav-link', activeClassName: 'active' }, 'Reference'),
        createElement(Link, { to: '/getting-started', className: 'nav-link', activeClassName: 'active' }, 'Get Started'),
        createElement(Link, { to: '/featureflags', className: 'nav-link', activeClassName: 'active' }, 'Flags'),
      ),
    ),
  );
}
