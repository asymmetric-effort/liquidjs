import { createElement } from 'liquidjs';
import { Router, useRouter, FeatureFlagProvider } from 'liquidjs';
import { NavBar } from './components/nav-bar';
import { Footer } from './components/footer';
import { HomeScreen } from './screens/home';
import { ComponentsGallery } from './screens/components-gallery';
import { EconomicDashboard } from './screens/economic-dashboard';
import { ConcurrentDemo } from './screens/concurrent-demo';
import { ApiIntegration } from './screens/api-integration';
import { ComponentReference } from './screens/component-reference';
import { GettingStarted } from './screens/getting-started';
import { FeatureFlagsDemo } from './screens/feature-flags-demo';

function AppContent() {
  const { pathname, navigate } = useRouter();

  const isHome = pathname === '/';

  // Map routes to screen components
  let dialogTitle: string | null = null;
  let dialogContent: ReturnType<typeof createElement> | null = null;

  if (pathname.startsWith('/components')) {
    dialogTitle = 'Component Gallery';
    dialogContent = createElement(ComponentsGallery, null);
  } else if (pathname.startsWith('/dashboard')) {
    dialogTitle = 'Economic Dashboard';
    dialogContent = createElement(EconomicDashboard, null);
  } else if (pathname.startsWith('/concurrent')) {
    dialogTitle = 'Concurrent Rendering';
    dialogContent = createElement(ConcurrentDemo, null);
  } else if (pathname.startsWith('/api')) {
    dialogTitle = 'API Integration';
    dialogContent = createElement(ApiIntegration, null);
  } else if (pathname.startsWith('/reference')) {
    dialogTitle = 'Component Reference';
    dialogContent = createElement(ComponentReference, null);
  } else if (pathname.startsWith('/getting-started')) {
    dialogTitle = 'Getting Started';
    dialogContent = createElement(GettingStarted, null);
  } else if (pathname.startsWith('/featureflags')) {
    dialogTitle = 'Feature Flags';
    dialogContent = createElement(FeatureFlagsDemo, null);
  }

  const handleClose = () => navigate('/');
  const handleBackdropClick = (e: Event) => {
    if ((e.target as HTMLElement).classList.contains('dialog-backdrop')) {
      handleClose();
    }
  };

  return createElement(
    'div',
    null,
    // Home page is always present as the base layer
    createElement(
      'main',
      { className: 'main-content' },
      createElement(HomeScreen, null),
    ),
    // Dialog overlay for non-home screens
    !isHome && dialogContent
      ? createElement(
          'div',
          {
            className: 'dialog-backdrop',
            onClick: handleBackdropClick,
          },
          createElement(
            'div',
            { className: 'dialog-panel' },
            createElement(
              'div',
              { className: 'dialog-header' },
              createElement('h2', { className: 'dialog-title' }, dialogTitle),
              createElement(
                'button',
                {
                  className: 'dialog-close',
                  onClick: handleClose,
                  'aria-label': 'Close',
                },
                '\u00d7',
              ),
            ),
            createElement(
              'div',
              { className: 'dialog-body' },
              dialogContent,
            ),
          ),
        )
      : null,
    createElement(Footer, null),
  );
}

export function App() {
  return createElement(
    FeatureFlagProvider,
    { url: './features.json', defaults: { charts: true, dashboard: true } },
    createElement(
      Router,
      null,
      createElement(NavBar, null),
      createElement(AppContent, null),
    ),
  );
}
