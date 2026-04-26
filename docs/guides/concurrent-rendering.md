# Concurrent Rendering

Concurrent rendering allows SpecifyJS to work on multiple state updates simultaneously, prioritizing urgent interactions (like typing) over less critical updates (like filtering a large list). This keeps the UI responsive even during expensive renders.

## What Is Concurrent Rendering

In synchronous rendering, every state update blocks the main thread until the entire component tree re-renders. With concurrent rendering, SpecifyJS can interrupt a low-priority render to process a higher-priority update first, then resume or restart the lower-priority work.

Concurrent rendering is enabled automatically when you use `createRoot`:

```typescript
import { createRoot } from 'specifyjs/dom';

const root = createRoot(document.getElementById('root'));
root.render(createElement(App, null));
```

## Lane-Based Priority System

SpecifyJS uses a lane-based priority system to classify updates. Each update is assigned a lane that determines its urgency:

| Lane | Priority | Use Case |
|------|----------|----------|
| `SyncLane` | Highest | `flushSync`, discrete user events |
| `DefaultLane` | Normal | Standard state updates, event handlers |
| `TransitionLane` | Lower | Updates inside `startTransition` |

Higher-priority lanes interrupt lower-priority work. When a `SyncLane` update arrives while a `TransitionLane` render is in progress, the transition render is paused and the sync update is processed first.

## useTransition for Non-Urgent Updates

The `useTransition` hook marks a state update as non-urgent. It returns an `isPending` flag and a `startTransition` function:

```typescript
import { useState, useTransition } from 'specifyjs/hooks';
import { createElement } from 'specifyjs';

function SearchableList(props: { items: string[] }) {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState(props.items);
  const [isPending, startTransition] = useTransition();

  function handleInput(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    setQuery(value);                        // Urgent: update the input immediately
    startTransition(() => {
      setFiltered(                          // Non-urgent: filter can wait
        props.items.filter((item) => item.toLowerCase().includes(value.toLowerCase())),
      );
    });
  }

  return createElement('div', null,
    createElement('input', { value: query, onInput: handleInput, placeholder: 'Search...' }),
    isPending
      ? createElement('p', null, 'Filtering...')
      : null,
    createElement('ul', null,
      filtered.map((item) => createElement('li', { key: item }, item)),
    ),
  );
}
```

The input field updates instantly because `setQuery` is a normal (default lane) update. The list filtering happens inside `startTransition`, so it can be interrupted if the user types again before filtering completes.

## useDeferredValue for Expensive Computations

`useDeferredValue` returns a deferred copy of a value. The deferred value lags behind during urgent updates, allowing the UI to remain responsive:

```typescript
import { useState, useDeferredValue, useMemo } from 'specifyjs/hooks';

function ExpensiveChart(props: { data: number[] }) {
  const [filter, setFilter] = useState('');
  const deferredFilter = useDeferredValue(filter);

  const filteredData = useMemo(() => {
    return props.data.filter((d) => expensiveCheck(d, deferredFilter));
  }, [props.data, deferredFilter]);

  const isStale = filter !== deferredFilter;

  return createElement('div', null,
    createElement('input', {
      value: filter,
      onInput: (e) => setFilter((e.target as HTMLInputElement).value),
    }),
    createElement('div', {
      style: { opacity: isStale ? 0.6 : 1, transition: 'opacity 0.2s' },
    },
      createElement(Chart, { data: filteredData }),
    ),
  );
}
```

While the user types, `deferredFilter` lags behind `filter`. The chart re-renders with the deferred value, which can be interrupted if new input arrives. The stale state is indicated visually by reducing opacity.

## startTransition API

The standalone `startTransition` function works the same as the hook version but can be used outside of components:

```typescript
import { startTransition } from 'specifyjs';

function handleNavigation(url: string) {
  startTransition(() => {
    setCurrentRoute(url);
  });
}
```

State updates inside `startTransition` are assigned a `TransitionLane`, making them interruptible by higher-priority updates. Unlike `useTransition`, the standalone function does not provide an `isPending` flag.

## When to Use Concurrent Features

Use concurrent features when a state update triggers an expensive re-render that could block user interaction:

**Good candidates for transitions:**
- Filtering or sorting large lists
- Navigating between routes (loading new page content)
- Updating visualizations or charts with large datasets
- Search-as-you-type with results rendering

**Not needed for:**
- Simple state toggles (show/hide, open/close)
- Form input updates with minimal re-renders
- State changes that affect only a small subtree

### Guidelines

1. Keep urgent updates (text input, button feedback) outside `startTransition`.
2. Wrap expensive, non-blocking updates in `startTransition` or use `useDeferredValue`.
3. Show visual feedback during pending transitions (spinners, opacity changes).
4. Do not overuse transitions. Most updates are fast enough without them. Profile first, then optimize.
5. Combine `useMemo` with `useDeferredValue` to avoid recomputing expensive derived data on every keystroke.
