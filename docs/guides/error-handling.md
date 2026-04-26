# Error Handling

Errors in a UI tree can leave the entire application in a broken state. SpecifyJS provides **error boundaries** -- class components that catch errors during rendering, lifecycle methods, and constructors of any component below them in the tree.

## What Happens When a Component Throws

When a component throws during rendering, SpecifyJS walks up the fiber tree looking for an ancestor with `componentDidCatch` or `getDerivedStateFromError`. If one is found, the boundary captures the error and re-renders with fallback UI. If no boundary exists, the entire tree unmounts.

## Using the Built-in ErrorBoundary

SpecifyJS exports a ready-made `ErrorBoundary` component. Wrap any subtree that might fail:

```typescript
import { createElement, ErrorBoundary } from 'specifyjs';

function App() {
  return createElement(ErrorBoundary, {
    fallback: createElement('p', null, 'Something went wrong.'),
    onError: (error: unknown, info: ErrorInfo) => {
      console.error('Caught by boundary:', error, info.componentStack);
    },
  },
    createElement(UnstableWidget, null),
  );
}
```

The `ErrorBoundaryProps` interface accepts:

| Prop       | Type                                         | Purpose                               |
|------------|----------------------------------------------|---------------------------------------|
| `fallback` | `SpecNode`                                   | UI rendered when an error is caught   |
| `onError`  | `(error: unknown, info: ErrorInfo) => void`  | Callback for logging or side effects  |
| `children` | `SpecNode`                                   | Normal child tree                     |

## Building a Custom Error Boundary

Any class component becomes an error boundary when it implements one or both of the static and instance lifecycle methods:

```typescript
import { Component, createElement } from 'specifyjs';
import type { SpecNode, ErrorInfo, Props } from 'specifyjs';

interface BoundaryProps extends Props {
  children?: SpecNode;
}

interface BoundaryState {
  hasError: boolean;
  error: unknown;
}

class CustomBoundary extends Component<BoundaryProps, BoundaryState> {
  static getDerivedStateFromError(error: unknown): Partial<BoundaryState> {
    // Update state so the next render shows fallback UI.
    return { hasError: true, error };
  }

  constructor(props: BoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  componentDidCatch(error: unknown, info: ErrorInfo): void {
    // Side effects: send to a logging service, analytics, etc.
    reportErrorToService(error, info.componentStack);
  }

  render(): SpecNode {
    if (this.state.hasError) {
      return createElement('div', { role: 'alert' },
        createElement('h2', null, 'Unexpected Error'),
        createElement('pre', null, String(this.state.error)),
      );
    }
    return this.props.children ?? null;
  }
}
```

### getDerivedStateFromError vs componentDidCatch

- **`getDerivedStateFromError(error)`** -- A static method called during the render phase. It returns a partial state update used to switch to fallback UI. It must be a pure function with no side effects.
- **`componentDidCatch(error, info)`** -- An instance method called during the commit phase. Use it for side effects like error logging. The `info` argument contains a `componentStack` string showing the component ancestry.

## Fallback UI Patterns

### Simple message

```typescript
createElement(ErrorBoundary, {
  fallback: createElement('p', null, 'This section is unavailable.'),
}, children);
```

### Retry button

```typescript
class RetryBoundary extends Component<BoundaryProps, BoundaryState> {
  static getDerivedStateFromError(error: unknown): Partial<BoundaryState> {
    return { hasError: true, error };
  }

  constructor(props: BoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render(): SpecNode {
    if (this.state.hasError) {
      return createElement('div', { role: 'alert' },
        createElement('p', null, 'Something went wrong.'),
        createElement('button', { onClick: this.handleRetry }, 'Try Again'),
      );
    }
    return this.props.children ?? null;
  }
}
```

Calling `setState` to clear the error causes the boundary to attempt rendering the children again.

## Error Recovery Strategies

1. **Retry rendering** -- Reset the boundary state to re-mount children (shown above).
2. **Granular boundaries** -- Place boundaries around individual widgets rather than the entire app. A failing sidebar should not take down the main content area.
3. **Progressive degradation** -- Show reduced functionality in fallback UI rather than a blank screen.
4. **Route-level boundaries** -- Wrap each route in a boundary so navigation errors are isolated.

## Logging Errors

Use the `onError` prop (built-in boundary) or `componentDidCatch` (custom boundary) to send errors to external services:

```typescript
function logError(error: unknown, componentStack: string): void {
  fetch('/api/errors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      componentStack,
      timestamp: Date.now(),
    }),
  });
}
```

## Error Boundaries and Async Operations

Error boundaries catch errors thrown **synchronously** during rendering and lifecycle methods. They do **not** catch errors inside event handlers or asynchronous code (promises, `setTimeout`). Handle those with standard try/catch and local state:

```typescript
function DataLoader() {
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(d => setData(d.value))
      .catch(err => setError(err.message));
  }, []);

  if (error) {
    return createElement('p', { role: 'alert' }, `Load failed: ${error}`);
  }
  return createElement('p', null, data ?? 'Loading...');
}
```

Combine both patterns for full coverage: an error boundary around the component tree and local error state for async work within individual components.

## See Also

- [API Reference: ErrorBoundary](../api/error-boundary.md)
- [API Reference: Component](../api/component.md)
- [Core Concepts](./core-concepts.md)
