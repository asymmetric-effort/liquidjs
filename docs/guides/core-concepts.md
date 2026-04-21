# Core Concepts

## Elements

LiquidJS elements are lightweight objects describing what to render:

```typescript
const element = createElement('div', { className: 'card' },
  createElement('h2', null, 'Title'),
  createElement('p', null, 'Content'),
);
```

## Function Components

Components are functions that return elements:

```typescript
function Greeting(props: { name: string }) {
  return createElement('h1', null, `Hello, ${props.name}!`);
}
```

## Props

Props are read-only inputs passed to components:

```typescript
createElement(Greeting, { name: 'World' });
```

Reserved props: `key` (reconciliation identity) and `ref` (DOM/instance access).

## State

Components manage local state with `useState`:

```typescript
function Counter() {
  const [count, setCount] = useState(0);
  return createElement('button', {
    onClick: () => setCount(prev => prev + 1),
  }, `Clicked ${count} times`);
}
```

## Lifecycle (Effects)

Side effects run after rendering:

```typescript
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id); // Cleanup
  }, []); // Empty deps = run once

  return createElement('span', null, `${seconds}s`);
}
```

## Context

Share values through the component tree without prop drilling:

```typescript
const ThemeContext = createContext('light');

function App() {
  return createElement(ThemeContext.Provider, { value: 'dark' },
    createElement(ThemedButton, null),
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return createElement('button', { className: theme }, 'Click');
}
```

## Fragments

Group children without extra DOM nodes:

```typescript
createElement(Fragment, null,
  createElement('span', null, 'A'),
  createElement('span', null, 'B'),
);
```

## Keys

Use `key` for efficient list reconciliation:

```typescript
items.map(item =>
  createElement('li', { key: item.id }, item.name)
);
```

## Next Steps

- [Hooks API](../api/hooks.md) — Full hook reference
- [Building SPAs](building-spas.md) — Application patterns
