import { createElement } from 'liquidjs';
import { Router, Route } from 'liquidjs';
import { NavBar } from './components/nav-bar';
import { HomeScreen } from './screens/home';
import { ComponentsGallery } from './screens/components-gallery';
import { EconomicDashboard } from './screens/economic-dashboard';

export function App() {
  return createElement(Router, null,
    createElement(NavBar, null),
    createElement('main', { className: 'main-content' },
      createElement(Route, { path: '/', component: HomeScreen, exact: true }),
      createElement(Route, { path: '/components', component: ComponentsGallery }),
      createElement(Route, { path: '/dashboard', component: EconomicDashboard }),
    ),
  );
}
