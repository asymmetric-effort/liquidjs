import { createElement } from 'liquidjs';
import { Link } from 'liquidjs';

export function NavBar() {
  return createElement('nav', { className: 'nav-bar' },
    createElement('div', { className: 'nav-bar-inner' },
      createElement(Link, { to: '/', className: 'nav-logo', exact: true }, 'LiquidJS'),
      createElement('div', { className: 'nav-links' },
        createElement(Link, { to: '/', className: 'nav-link', activeClassName: 'active', exact: true }, 'Home'),
        createElement(Link, { to: '/components', className: 'nav-link', activeClassName: 'active' }, 'Components'),
        createElement(Link, { to: '/dashboard', className: 'nav-link', activeClassName: 'active' }, 'Dashboard'),
      ),
    ),
  );
}
