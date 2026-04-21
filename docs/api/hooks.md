# Hooks API

All hooks must be called inside function component bodies. Calling hooks outside a component throws an error.

## State Hooks

### `useState<T>(initialState: T | (() => T)): [T, setter]`

Returns a stateful value and a function to update it.

```typescript
const [count, setCount] = useState(0);
setCount(5);             // Direct value
setCount(prev => prev + 1); // Functional updater
```

### `useReducer<S, A>(reducer, initialArg, init?): [S, dispatch]`

Alternative to useState for complex state logic.

```typescript
const [state, dispatch] = useReducer(
  (state, action) => { switch(action.type) { ... } },
  { count: 0 }
);
dispatch({ type: 'increment' });
```

## Effect Hooks

### `useEffect(create, deps?): void`

Runs side effects after render. Returns an optional cleanup function.

```typescript
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}, []);
```

### `useLayoutEffect(create, deps?): void`

Like useEffect but fires synchronously after DOM mutations, before paint.

### `useInsertionEffect(create, deps?): void`

Fires before DOM mutations. Designed for CSS-in-JS libraries.

## Context Hooks

### `useContext<T>(context: LiquidContext<T>): T`

Reads the current value from the nearest matching Provider.

```typescript
const theme = useContext(ThemeContext);
```

## Ref Hooks

### `useRef<T>(initialValue?): { current: T }`

Returns a mutable ref object that persists across renders.

```typescript
const inputRef = useRef<HTMLInputElement>(null);
```

### `useImperativeHandle(ref, createHandle, deps?): void`

Customizes the instance value exposed to parent refs via `forwardRef`.

## Performance Hooks

### `useMemo<T>(factory: () => T, deps): T`

Memoizes an expensive computation. Recomputes only when deps change.

```typescript
const sorted = useMemo(() => items.sort(compareFn), [items]);
```

### `useCallback<T>(callback: T, deps): T`

Returns a memoized callback. Equivalent to `useMemo(() => callback, deps)`.

```typescript
const handleClick = useCallback(() => setCount(c => c + 1), []);
```

### `memo(component, compare?)`

Wraps a component to skip re-renders when props are shallowly equal.

## Identity Hooks

### `useId(): string`

Generates a unique ID stable across server and client renders.

```typescript
const id = useId(); // ":l0:", ":l1:", etc.
```

## Transition Hooks

### `useTransition(): [isPending, startTransition]`

Marks state updates as non-urgent transitions.

### `useDeferredValue<T>(value: T): T`

Defers a value update to avoid blocking urgent updates.

## External Store Hooks

### `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?): T`

Subscribes to an external data source.

## Debug Hooks

### `useDebugValue(value, format?): void`

Displays a label in DevTools for custom hooks. No-op in production.
