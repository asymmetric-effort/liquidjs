# Building Single-Page Applications

SpecifyJS is designed for building SPAs that compile to minified JavaScript for high-performance browser execution.

## Application Structure

A typical SpecifyJS SPA:

```
my-app/
  src/
    app.ts          # Root component
    components/     # Reusable components
    hooks/          # Custom hooks
    context/        # Application context providers
  index.html        # HTML shell with <div id="root">
  vite.config.ts    # Build configuration
```

## Entry Point

```typescript
// src/app.ts
import { createElement } from 'specifyjs';
import { createRoot } from 'specifyjs/dom';

function App() {
  return createElement('div', { id: 'app' },
    createElement(Router, null),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
```

## State Management

### Local State
Use `useState` for component-local state:

```typescript
const [items, setItems] = useState<Item[]>([]);
```

### Complex State
Use `useReducer` for state with multiple actions:

```typescript
const [state, dispatch] = useReducer(reducer, initialState);
```

### Shared State
Use `createContext` + `useContext` for app-wide state:

```typescript
const AppContext = createContext(defaultState);
```

## Performance Patterns

- **`memo`** — Skip re-renders when props haven't changed
- **`useMemo`** — Cache expensive computations
- **`useCallback`** — Stable function references for child components
- **Keys** — Efficient list reconciliation

## Production Build

SpecifyJS apps compile to minified, tree-shaken bundles via Vite/Rollup:

```bash
npx vite build
```

Target: < 50KB gzipped including framework overhead.

## Example Apps

See `core/examples/` for complete working SPAs:

- **Todo App** — Lists, events, filters, refs
- **Counter App** — useReducer, useMemo, useCallback
- **Form App** — Context, controlled inputs, validation

## Next Steps

- [Testing](testing.md) — How to test your SPA
- [Production Builds](production-builds.md) — Optimization and deployment
