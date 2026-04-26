# Troubleshooting

Common questions and solutions when working with SpecifyJS.

---

## Why isn't my component re-rendering?

Components only re-render when their state changes via `useState` or `useReducer`, or when their parent re-renders with new props. Common causes:

- **Mutating state directly.** Never modify state objects in place. Always create a new reference:

```typescript
// Wrong: mutating the existing array
items.push(newItem);
setItems(items);

// Correct: creating a new array
setItems([...items, newItem]);
```

- **Same reference.** If you pass the same object reference, SpecifyJS skips the re-render. Spread objects and arrays to create new references.

- **State not lifting high enough.** If a sibling component needs to react to a change, lift the state to the nearest common ancestor.

---

## How do I prevent unnecessary re-renders?

Use `memo` to skip re-renders when props have not changed:

```typescript
import { memo, createElement } from 'specifyjs';

const ExpensiveList = memo(function ExpensiveList(props: { items: string[] }) {
  return createElement('ul', null,
    props.items.map((item) => createElement('li', { key: item }, item)),
  );
});
```

Use `useMemo` for expensive computations and `useCallback` for stable function references passed as props:

```typescript
const sorted = useMemo(() => items.sort(compareFn), [items]);
const handleClick = useCallback(() => { doSomething(); }, []);
```

---

## Why do I get "hooks called in wrong order"?

Hooks must be called in the same order on every render. This error occurs when hooks are placed inside conditions, loops, or early returns:

```typescript
// Wrong
function MyComponent(props: { show: boolean }) {
  if (props.show) {
    const [value, setValue] = useState('');  // Conditional hook call
  }
  // ...
}

// Correct
function MyComponent(props: { show: boolean }) {
  const [value, setValue] = useState('');    // Always called
  if (!props.show) return null;
  // Use value here
}
```

Always place all hook calls at the top level of the component function body.

---

## How do I handle async data fetching?

Use `useEffect` with a cleanup flag to prevent updates after unmount:

```typescript
function UserProfile(props: { userId: string }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`/api/users/${props.userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setUser(data);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [props.userId]);

  if (loading) return createElement('p', null, 'Loading...');
  return createElement('h1', null, user.name);
}
```

The `cancelled` flag prevents state updates on an unmounted component. See the [Custom Hooks](./custom-hooks.md) guide for a reusable `useFetch` pattern.

---

## Why does my effect run twice in StrictMode?

`StrictMode` intentionally double-invokes effects during development to help detect side effects that do not clean up properly. If your effect runs twice, verify that:

1. Your cleanup function properly reverses the setup (remove listeners, cancel timers, abort fetches).
2. Your effect is idempotent -- running it twice produces the same result as running it once.

This double invocation only happens in development. Production builds run effects once.

---

## How do I debug state changes?

Use `useEffect` to log state values whenever they change:

```typescript
const [count, setCount] = useState(0);

useEffect(() => {
  console.log('count changed:', count);
}, [count]);
```

For complex state managed by `useReducer`, log inside the reducer function:

```typescript
function reducer(state: State, action: Action): State {
  console.log('action:', action.type, 'prev state:', state);
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 };
    default:
      return state;
  }
}
```

---

## What's the difference between useEffect and useLayoutEffect?

Both run after rendering, but at different times:

- **`useEffect`** runs asynchronously after the browser has painted. Use it for data fetching, subscriptions, logging, and most side effects.
- **`useLayoutEffect`** runs synchronously after DOM mutations but before the browser paints. Use it for measuring DOM elements, adjusting scroll position, or preventing visual flicker.

```typescript
// Measure an element's dimensions before the user sees it
useLayoutEffect(() => {
  const rect = ref.current.getBoundingClientRect();
  setHeight(rect.height);
}, []);
```

Prefer `useEffect` unless you specifically need to read or modify the DOM before the browser paints.

---

## How do I share state between components?

Three approaches, depending on scope:

1. **Lift state up.** Move state to the nearest common ancestor and pass it down via props.

2. **Context API.** For widely shared state (theme, user session, feature flags), use `createContext` and a Provider:

```typescript
const UserContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);
  return createElement(UserContext.Provider, { value: { user, setUser } },
    createElement(Dashboard, null),
  );
}

function Dashboard() {
  const { user } = useContext(UserContext);
  return createElement('p', null, `Hello, ${user?.name}`);
}
```

3. **External store with `useSyncExternalStore`.** For complex global state, create a store and subscribe components to it.

---

## Why is my list rendering slowly?

Large lists cause performance problems because every item creates DOM nodes. Solutions:

- **Add `key` props.** Always provide stable, unique keys so the reconciler can reuse existing DOM nodes instead of recreating them:

```typescript
items.map((item) => createElement('li', { key: item.id }, item.name));
```

- **Avoid index keys for dynamic lists.** Using array indices as keys causes incorrect reuse when items are inserted, removed, or reordered.

- **Memoize list items.** Wrap individual item components in `memo` to skip re-rendering unchanged items.

- **Virtualize.** For lists with hundreds or thousands of items, render only the visible portion using a windowing technique. Only create DOM nodes for items currently in the viewport.

- **Use transitions.** Wrap expensive list updates in `startTransition` so they do not block user input (see [Concurrent Rendering](./concurrent-rendering.md)).

---

## How do I handle form validation?

Validate on change or on submit using state:

```typescript
function LoginForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    // Submit the form
  }

  return createElement('form', { onSubmit: handleSubmit },
    createElement('input', {
      type: 'email',
      value: email,
      onInput: (e) => {
        setEmail((e.target as HTMLInputElement).value);
        setError('');
      },
    }),
    error ? createElement('p', { style: { color: 'red' } }, error) : null,
    createElement('button', { type: 'submit' }, 'Log In'),
  );
}
```

For complex forms with multiple fields, use `useReducer` to manage form state and validation errors together. See the [Forms and Validation](./forms-and-validation.md) guide for more patterns.
