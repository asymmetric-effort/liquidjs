# State Management

SpecifyJS provides a layered approach to state management. Simple components use `useState`, components with complex transitions use `useReducer`, and cross-component state is shared through the Context API. For integration with external stores, `useSyncExternalStore` provides tear-free reads with automatic re-rendering.

## Local State with useState

The `useState` hook is the foundation of state management. It returns a tuple of the current value and a setter function:

```typescript
import { createElement, useState } from 'specifyjs';

function Counter() {
  const [count, setCount] = useState(0);

  return createElement('div', null,
    createElement('p', null, `Count: ${count}`),
    createElement('button', {
      onClick: () => setCount(count + 1),
    }, 'Increment'),
  );
}
```

### Functional Updates

When the next state depends on the previous state, pass a function to the setter. This avoids stale closures when multiple updates are batched:

```typescript
// Correct -- always reads the latest value
setCount(prev => prev + 1);

// Risky -- may use a stale closure value
setCount(count + 1);
```

### Lazy Initialization

If computing the initial state is expensive, pass a function to `useState`. It runs only on the first render:

```typescript
const [data, setData] = useState(() => parseExpensiveData(rawInput));
```

## Complex State with useReducer

When state transitions follow predictable rules or involve multiple related values, `useReducer` provides a clearer structure than multiple `useState` calls:

```typescript
import { createElement, useReducer } from 'specifyjs';

interface FormState {
  name: string;
  email: string;
  submitting: boolean;
  error: string | null;
}

type FormAction =
  | { type: 'SET_FIELD'; field: string; value: string }
  | { type: 'SUBMIT' }
  | { type: 'SUCCESS' }
  | { type: 'ERROR'; message: string };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SUBMIT':
      return { ...state, submitting: true, error: null };
    case 'SUCCESS':
      return { ...state, submitting: false };
    case 'ERROR':
      return { ...state, submitting: false, error: action.message };
  }
}

function ContactForm() {
  const [state, dispatch] = useReducer(formReducer, {
    name: '',
    email: '',
    submitting: false,
    error: null,
  });

  return createElement('form', null,
    createElement('input', {
      value: state.name,
      onChange: (e: Event) =>
        dispatch({ type: 'SET_FIELD', field: 'name', value: (e.target as HTMLInputElement).value }),
    }),
    createElement('button', {
      onClick: () => dispatch({ type: 'SUBMIT' }),
      disabled: state.submitting,
    }, 'Submit'),
    state.error ? createElement('p', { className: 'error' }, state.error) : null,
  );
}
```

### Lazy Initialization with useReducer

The optional third argument to `useReducer` is an initializer function. It receives the second argument and returns the initial state:

```typescript
const [state, dispatch] = useReducer(reducer, rawConfig, (config) => ({
  ...parseConfig(config),
  loaded: true,
}));
```

## Sharing State with Context

The Context API passes data through the component tree without manually threading props through every level. It consists of three parts: `createContext`, the `Provider`, and `useContext`.

### Creating a Context

```typescript
import { createContext } from 'specifyjs';

interface ThemeContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => {},
});
```

The argument to `createContext` is the default value used when no `Provider` is found above the consuming component.

### Providing Context

Wrap a subtree with the `Provider` to supply a value:

```typescript
import { createElement, useState, useCallback } from 'specifyjs';

function ThemeProvider(props: { children?: unknown }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = useCallback((() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }) as (...args: unknown[]) => unknown, []);

  const value = { theme, toggleTheme: toggleTheme as () => void };

  return createElement(ThemeContext.Provider, { value }, props.children);
}
```

### Consuming Context

Use the `useContext` hook to read the nearest ancestor `Provider` value:

```typescript
import { useContext } from 'specifyjs';

function ThemedButton(props: { label: string }) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return createElement('button', {
    className: `btn--${theme}`,
    onClick: toggleTheme,
  }, props.label);
}
```

When the `Provider` value changes, all components that call `useContext` for that context re-render automatically.

## When to Use Each Approach

| Approach | Best For |
|----------|----------|
| `useState` | Simple, independent values (toggles, counters, form fields). |
| `useReducer` | Complex state with multiple sub-values or strict transition rules. |
| Context | Cross-cutting concerns (theme, locale, auth) shared by many components. |
| `useSyncExternalStore` | Integration with external stores, real-time data, or shared mutable state. |

**Rule of thumb**: start with `useState`. Move to `useReducer` when you find yourself coordinating multiple `useState` calls in the same component. Lift to Context when sibling or distant components need the same data.

## Patterns for Large Applications

### Context + useReducer

Combine Context and `useReducer` to create a lightweight application-level store without any external libraries:

```typescript
import { createContext, createElement, useReducer, useContext } from 'specifyjs';

interface AppState {
  user: { name: string } | null;
  notifications: string[];
}

type AppAction =
  | { type: 'LOGIN'; name: string }
  | { type: 'LOGOUT' }
  | { type: 'ADD_NOTIFICATION'; message: string };

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: { name: action.name } };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.message] };
  }
}

const AppStateContext = createContext<AppState>({ user: null, notifications: [] });
const AppDispatchContext = createContext<(action: AppAction) => void>(() => {});

function AppProvider(props: { children?: unknown }) {
  const [state, dispatch] = useReducer(appReducer, {
    user: null,
    notifications: [],
  });

  return createElement(AppStateContext.Provider, { value: state },
    createElement(AppDispatchContext.Provider, { value: dispatch },
      props.children,
    ),
  );
}

// Consumers only re-render when they read the part of context that changed
function useAppState(): AppState {
  return useContext(AppStateContext);
}

function useAppDispatch(): (action: AppAction) => void {
  return useContext(AppDispatchContext);
}
```

Splitting state and dispatch into separate contexts is important: components that only dispatch actions (e.g., a logout button) will not re-render when state changes.

## Performance Considerations

### Avoiding Unnecessary Re-renders

1. **Memoize callbacks** with `useCallback` so child components receiving them as props do not re-render when the parent re-renders:

    ```typescript
    const handleClick = useCallback((() => {
      setOpen(prev => !prev);
    }) as (...args: unknown[]) => unknown, []);
    ```

2. **Memoize computed values** with `useMemo` to skip expensive recalculations:

    ```typescript
    const sortedItems = useMemo(() =>
      items.slice().sort((a, b) => a.name.localeCompare(b.name)),
      [items],
    );
    ```

3. **Split contexts** to prevent unrelated updates from triggering re-renders across the tree (as shown in the Context + useReducer pattern above).

4. **Use `memo`** to skip re-rendering a component when its props have not changed:

    ```typescript
    import { memo, createElement } from 'specifyjs';

    const ExpensiveList = memo(function ExpensiveList(props: { items: string[] }) {
      return createElement('ul', null,
        ...props.items.map(item => createElement('li', { key: item }, item)),
      );
    });
    ```

## External Store Integration

The `useSyncExternalStore` hook connects SpecifyJS components to any external data source that follows the subscribe/getSnapshot pattern. This is the recommended approach for integrating with third-party state libraries, browser APIs, or shared mutable state:

```typescript
import { useSyncExternalStore } from 'specifyjs';

// A simple external store
let externalCount = 0;
const listeners = new Set<() => void>();

const counterStore = {
  increment() {
    externalCount++;
    listeners.forEach(fn => fn());
  },
  subscribe(callback: () => void) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },
  getSnapshot() {
    return externalCount;
  },
};

function ExternalCounter() {
  const count = useSyncExternalStore(
    counterStore.subscribe,
    counterStore.getSnapshot,
  );

  return createElement('div', null,
    createElement('p', null, `External count: ${count}`),
    createElement('button', {
      onClick: () => counterStore.increment(),
    }, 'Increment'),
  );
}
```

The hook guarantees that the component always sees a consistent snapshot, even during concurrent rendering. When the store notifies subscribers, SpecifyJS compares the new snapshot with `Object.is` and only re-renders if the value has changed.

## Custom Hooks for Encapsulating State Logic

Extract reusable state patterns into custom hooks. A custom hook is any function whose name starts with `use` and calls other hooks:

```typescript
function useToggle(initial: boolean = false): [boolean, () => void] {
  const [value, setValue] = useState(initial);

  const toggle = useCallback((() => {
    setValue(prev => !prev);
  }) as (...args: unknown[]) => unknown, []);

  return [value, toggle as () => void];
}

function useLocalStorage<T>(key: string, defaultValue: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored !== null ? JSON.parse(stored) as T : defaultValue;
  });

  const setAndPersist = useCallback(((next: T) => {
    setValue(next);
    localStorage.setItem(key, JSON.stringify(next));
  }) as (...args: unknown[]) => unknown, [key]);

  return [value, setAndPersist as (v: T) => void];
}
```

Usage:

```typescript
function SettingsPanel() {
  const [darkMode, toggleDarkMode] = useToggle(false);
  const [fontSize, setFontSize] = useLocalStorage('fontSize', 16);

  return createElement('div', null,
    createElement('button', { onClick: toggleDarkMode },
      darkMode ? 'Light Mode' : 'Dark Mode',
    ),
    createElement('input', {
      type: 'range',
      min: '12',
      max: '24',
      value: String(fontSize),
      onChange: (e: Event) =>
        setFontSize(Number((e.target as HTMLInputElement).value)),
    }),
  );
}
```

## Anti-Patterns to Avoid

1. **Storing derived data in state.** If a value can be computed from existing state or props, compute it inline or with `useMemo` rather than duplicating it in a separate `useState`:

    ```typescript
    // Bad -- duplicated state that can get out of sync
    const [items, setItems] = useState<string[]>([]);
    const [count, setCount] = useState(0); // always items.length

    // Good -- derive it
    const count = items.length;
    ```

2. **Putting everything in Context.** Context is not a global store. Every value change re-renders all consumers. Use Context for low-frequency data (theme, locale, auth) and local state for high-frequency data (form input, animations).

3. **Mutating state directly.** Always create new objects or arrays when updating state. Mutations bypass change detection and cause stale renders:

    ```typescript
    // Bad -- mutates the existing array
    items.push(newItem);
    setItems(items);

    // Good -- creates a new array
    setItems([...items, newItem]);
    ```

4. **Missing dependency arrays.** Omitting the dependency array on `useEffect`, `useMemo`, or `useCallback` causes the hook to run on every render, defeating memoization.

5. **Oversized reducers.** Keep reducers focused on a single domain. If your reducer handles dozens of unrelated action types, split it into separate reducers with separate contexts.

## See Also

- [Core Concepts](./core-concepts.md) -- elements, components, props, and hooks overview
- [Routing](./routing.md) -- hash-based navigation and route parameters
- [Testing](./testing.md) -- testing components with state and effects
