# Code Splitting

Code splitting lets you break your application into smaller chunks that are loaded on demand. SpecifyJS supports this through `lazy()` for dynamic imports and `Suspense` for rendering fallback UI while chunks load.

## lazy() for Dynamic Imports

The `lazy` function wraps a dynamic `import()` call and returns a component that loads its implementation on first render:

```typescript
import { createElement, lazy, Suspense } from 'specifyjs';

const HeavyChart = lazy(() => import('./components/HeavyChart'));

function Dashboard() {
  return createElement(Suspense, { fallback: createElement('p', null, 'Loading chart...') },
    createElement(HeavyChart, { data: chartData }),
  );
}
```

The module passed to `lazy` must have a `default` export that is a SpecifyJS component:

```typescript
// components/HeavyChart.ts
export default function HeavyChart(props: { data: number[] }) {
  return createElement('canvas', { className: 'chart' });
}
```

## Suspense Boundaries with Fallback

Every `lazy` component must be wrapped in a `Suspense` boundary. The `fallback` prop defines what to show while the component is loading:

```typescript
createElement(Suspense, {
  fallback: createElement('div', { className: 'spinner' }, 'Loading...'),
},
  createElement(LazyComponent, null),
);
```

You can nest multiple lazy components under a single `Suspense` boundary. The fallback is shown until all children within the boundary have loaded:

```typescript
createElement(Suspense, { fallback: createElement('p', null, 'Loading page...') },
  createElement(LazyHeader, null),
  createElement(LazyContent, null),
  createElement(LazyFooter, null),
);
```

## Route-Based Code Splitting

The most common use of code splitting is at the route level. Each route loads its page component lazily:

```typescript
import { createElement, lazy, Suspense } from 'specifyjs';

const HomePage = lazy(() => import('./pages/Home'));
const AboutPage = lazy(() => import('./pages/About'));
const SettingsPage = lazy(() => import('./pages/Settings'));

function App() {
  // Assuming a router that provides currentRoute
  const { currentRoute } = useRouter();

  const pages: Record<string, ReturnType<typeof lazy>> = {
    '/': HomePage,
    '/about': AboutPage,
    '/settings': SettingsPage,
  };

  const Page = pages[currentRoute] || HomePage;

  return createElement(Suspense, {
    fallback: createElement('div', { className: 'page-loader' }, 'Loading...'),
  },
    createElement(Page, null),
  );
}
```

This ensures that the JavaScript for each page is only downloaded when the user navigates to that route, reducing the initial bundle size.

## Component-Level Code Splitting

You can also split at the component level for heavy widgets that are not always visible:

```typescript
const MarkdownEditor = lazy(() => import('./components/MarkdownEditor'));
const DataGrid = lazy(() => import('./components/DataGrid'));

function AdminPanel() {
  const [showEditor, setShowEditor] = useState(false);

  return createElement('div', null,
    createElement('button', {
      onClick: () => setShowEditor(true),
    }, 'Open Editor'),
    showEditor
      ? createElement(Suspense, {
          fallback: createElement('p', null, 'Loading editor...'),
        },
          createElement(MarkdownEditor, null),
        )
      : null,
  );
}
```

The editor chunk is only fetched when the user clicks the button.

## Error Handling with Lazy Components

If a dynamic import fails (network error, missing chunk), the promise rejects and the error propagates up the component tree. Use an error boundary to catch it:

```typescript
import { Component } from 'specifyjs';

class LazyErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return createElement('div', { className: 'error' },
        createElement('p', null, 'Failed to load component.'),
        createElement('button', {
          onClick: () => this.setState({ hasError: false }),
        }, 'Retry'),
      );
    }
    return this.props.children;
  }
}

// Usage
createElement(LazyErrorBoundary, null,
  createElement(Suspense, { fallback: createElement('p', null, 'Loading...') },
    createElement(LazyComponent, null),
  ),
);
```

When the user clicks "Retry", the error boundary resets and `lazy` re-attempts the import. This pattern is essential for production applications where network reliability varies.
