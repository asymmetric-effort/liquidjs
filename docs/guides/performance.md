# Performance Optimization

This guide explains how SpecifyJS renders, why unnecessary work happens, and the tools available to eliminate it.

## How SpecifyJS Renders

SpecifyJS uses a three-phase rendering pipeline:

1. **Begin work** -- Traverse the fiber tree top-down. For each component fiber, call the component function to produce new elements, then reconcile the returned children against the previous tree.
2. **Complete work** -- Walk the tree bottom-up, building or updating real DOM nodes for host fibers (div, span, etc.).
3. **Commit** -- Apply all accumulated DOM mutations in a single synchronous batch, then run effects (`useEffect`, `useLayoutEffect`).

Each fiber carries a lane bitmask indicating the priority of its pending update. The scheduler processes high-priority lanes (user input, `flushSync`) before lower-priority ones (transitions). During concurrent rendering, the begin-work phase can yield to the browser between fibers, keeping the main thread responsive.

## Why Unnecessary Re-Renders Happen

A component re-renders whenever its parent re-renders, regardless of whether its props changed. Consider:

```typescript
function Parent() {
  const [count, setCount] = useState(0);
  return createElement('div', null,
    createElement('button', { onClick: () => setCount(c => c + 1) }, 'Increment'),
    createElement(ExpensiveChild, null),  // re-renders every time
  );
}
```

`ExpensiveChild` receives no props that change, yet it re-renders on every click because `Parent` creates a new element for it each time. This is where memoization helps.

## memo() for Component Memoization

Wrap a component with `memo` to skip re-rendering when its props have not changed (shallow comparison by default):

```typescript
import { memo, createElement } from 'specifyjs';

const ExpensiveChild = memo(function ExpensiveChild(props: { data: string }) {
  // Only re-renders when props.data changes
  return createElement('div', null, computeExpensiveLayout(props.data));
});
```

Supply a custom comparator for more control:

```typescript
const Chart = memo(ChartComponent, (prev, next) => {
  return prev.data.length === next.data.length && prev.theme === next.theme;
});
```

Return `true` to skip the re-render, `false` to allow it -- the opposite of `shouldComponentUpdate`.

## useMemo() for Expensive Computations

When a render involves heavy computation, cache the result with `useMemo`:

```typescript
function FilteredList(props: { items: Item[]; query: string }) {
  const filtered = useMemo(
    () => props.items.filter(item => item.name.includes(props.query)),
    [props.items, props.query],
  );

  return createElement('ul', null,
    filtered.map(item =>
      createElement('li', { key: item.id }, item.name),
    ),
  );
}
```

The filter function only runs when `items` or `query` changes. Without `useMemo`, it would run on every render of the parent.

## useCallback() for Stable Function References

Functions defined inside a component are recreated on every render. When passed as props to memoized children, this defeats `memo`:

```typescript
function Parent() {
  const [count, setCount] = useState(0);

  // Unstable: new function every render
  const handleClick = () => console.log('clicked');

  // Stable: same reference unless deps change
  const stableHandleClick = useCallback(() => console.log('clicked'), []);

  return createElement('div', null,
    createElement(MemoizedButton, { onClick: stableHandleClick }),
  );
}
```

Use `useCallback` when passing functions to `memo`-wrapped children or as dependencies of `useEffect`.

## Key Props for Efficient List Reconciliation

The reconciler uses `key` props to match old and new children in a list. Without keys, it compares by position, which causes unnecessary DOM mutations when items are inserted, removed, or reordered:

```typescript
// Good: stable, unique keys
items.map(item =>
  createElement(Row, { key: item.id, data: item }),
);

// Bad: index keys cause problems on reorder
items.map((item, i) =>
  createElement(Row, { key: i, data: item }),
);
```

Use a stable identifier from your data (database ID, slug, etc.) as the key. Avoid array indices unless the list is static and never reordered.

## Lazy Loading with lazy() and Suspense

Split your bundle by lazily loading components that are not needed on initial render:

```typescript
import { lazy, createElement, Suspense } from 'specifyjs';

const Settings = lazy(() => import('./Settings'));

function App() {
  return createElement(Suspense, { fallback: createElement('div', null, 'Loading...') },
    createElement(Settings, null),
  );
}
```

`lazy` accepts a function that returns a dynamic `import()` promise. The component is fetched only when it first renders. Until the module resolves, `Suspense` displays the fallback. This reduces the initial bundle size and speeds up first paint.

Place `Suspense` boundaries at meaningful UI divisions: route-level panels, modal content, or dashboard widgets.

## Concurrent Rendering with useTransition and useDeferredValue

### useTransition

Mark state updates as non-urgent so they do not block user input:

```typescript
function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleInput = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    setQuery(value);  // Urgent: update the input immediately

    startTransition(() => {
      setResults(filterLargeDataset(value));  // Non-urgent: can be interrupted
    });
  };

  return createElement('div', null,
    createElement('input', { value: query, onInput: handleInput }),
    isPending
      ? createElement('div', null, 'Updating...')
      : createElement('ul', null,
          results.map(r => createElement('li', { key: r }, r)),
        ),
  );
}
```

Updates inside `startTransition` receive a lower-priority lane. If a higher-priority update arrives (another keystroke), the in-progress transition is interrupted and restarted with the latest state.

### useDeferredValue

Defer an expensive derived value so the UI stays responsive:

```typescript
function HeavyVisualization(props: { data: number[] }) {
  const deferredData = useDeferredValue(props.data);

  // deferredData may lag behind props.data during rapid updates
  const chart = useMemo(() => buildChart(deferredData), [deferredData]);

  return createElement('div', null, chart);
}
```

## Bundle Size Optimization

### Tree-Shaking

Import only what you use. SpecifyJS is structured as named exports so bundlers can eliminate unused code:

```typescript
// Good: only pulls in createElement and useState
import { createElement } from 'specifyjs';
import { useState } from 'specifyjs/hooks';

// Avoid: barrel imports that may pull in the entire library
import * as Spec from 'specifyjs';
```

### Code Splitting

Use dynamic `import()` at route boundaries to split the bundle:

```typescript
const routes: Record<string, ReturnType<typeof lazy>> = {
  '/dashboard': lazy(() => import('./pages/Dashboard')),
  '/settings': lazy(() => import('./pages/Settings')),
  '/profile': lazy(() => import('./pages/Profile')),
};
```

Each route loads its own chunk on demand.

## Profiling with StrictMode

`StrictMode` intentionally double-renders components in development to surface impure renders and side effects:

```typescript
import { StrictMode, createElement } from 'specifyjs';

createElement(StrictMode, null,
  createElement(App, null),
);
```

If a component behaves differently across the two renders (e.g., it mutates external state during render), you have a purity violation that can cause bugs in concurrent mode. Fix these before optimizing.

## Common Performance Anti-Patterns

### Creating objects and arrays inline in props

```typescript
// Bad: new object every render defeats memo
createElement(Child, { style: { color: 'red' } });

// Good: stable reference
const style = useMemo(() => ({ color: 'red' }), []);
createElement(Child, { style });
```

### Defining components inside other components

```typescript
// Bad: new component type every render, destroys all child state
function Parent() {
  function Child() { return createElement('div', null, 'hi'); }
  return createElement(Child, null);
}

// Good: define outside
function Child() { return createElement('div', null, 'hi'); }
function Parent() { return createElement(Child, null); }
```

### Over-lifting state

Lifting state to a common ancestor is correct when siblings need to share it. But lifting state to the root when only a leaf needs it forces the entire tree to re-render. Keep state as close to its consumers as possible.

### Premature splitting of contexts

A single context with a large value causes every consumer to re-render on any change. Split contexts by update frequency:

```typescript
// Separate rarely-changing config from frequently-changing state
const ThemeContext = createContext('light');
const UserInputContext = createContext('');
```

## When NOT to Optimize

Not every re-render is a problem. Measure before optimizing:

1. **Most components are fast.** A component that returns a few elements takes microseconds to render. Wrapping it in `memo` adds comparison overhead that may exceed the render cost.

2. **Do not memoize everything.** `useMemo` and `useCallback` consume memory for the cached value and its dependency array. Use them when profiling shows a measurable improvement.

3. **Profile first.** Use browser DevTools Performance tab or the SpecifyJS `Profiler` component to identify actual bottlenecks. Optimize the slowest 5%, not the entire tree.

4. **Avoid premature code splitting.** Splitting a 2KB component into its own chunk adds a network round trip that costs more than the bytes saved. Split at meaningful boundaries where chunks are 20KB or larger.

5. **Readable code wins.** If an optimization makes the code significantly harder to understand, reconsider. Ship the simple version first and optimize when users report slowness.

## Summary Checklist

- Use `key` props on all list items with stable identifiers
- Wrap expensive pure components in `memo`
- Stabilize function props with `useCallback` when passed to memoized children
- Cache expensive computations with `useMemo`
- Split routes with `lazy` and `Suspense`
- Use `startTransition` for non-urgent updates that render large trees
- Keep state close to its consumers
- Define components outside of render functions
- Profile before optimizing -- measure, do not guess
