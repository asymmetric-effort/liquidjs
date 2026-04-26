# TypeScript Patterns

SpecifyJS is a **TypeScript-first** framework. The entire codebase is written in strict mode (`"strict": true`), and all public APIs ship with full type definitions. This guide covers common typing patterns you will encounter when building SpecifyJS applications.

## Typing Functional Components

Use the `FunctionComponent` type or define an explicit props interface with a return type of `SpecNode`:

```typescript
import { createElement } from 'specifyjs';
import type { FunctionComponent, SpecNode, Props } from 'specifyjs';

// Option 1: Inline props type
function Greeting(props: { name: string }): SpecNode {
  return createElement('h1', null, `Hello, ${props.name}!`);
}

// Option 2: Using FunctionComponent
interface CardProps extends Props {
  title: string;
  subtitle?: string;
}

const Card: FunctionComponent<CardProps> = (props) => {
  return createElement('div', { className: 'card' },
    createElement('h2', null, props.title),
    props.subtitle
      ? createElement('p', null, props.subtitle)
      : null,
  );
};
```

## Typing Props Interfaces

Props interfaces should extend `Props` when you need access to `children`, `key`, or `ref`:

```typescript
import type { Props, SpecNode, Ref } from 'specifyjs';

interface ButtonProps extends Props {
  label: string;
  variant: 'primary' | 'secondary';
  disabled?: boolean;
  onClick?: () => void;
  ref?: Ref<HTMLButtonElement>;
  children?: SpecNode;
}
```

The base `Props` type is `Record<string, unknown> & { children?: SpecNode; key?: Key; ref?: Ref }`, so extending it lets TypeScript enforce your custom fields while preserving built-in prop support.

## Typing Hooks

### useState with Generics

Provide a type parameter when the initial value does not fully express the type:

```typescript
const [user, setUser] = useState<User | null>(null);
const [items, setItems] = useState<string[]>([]);

// TypeScript infers `number` from the initial value here:
const [count, setCount] = useState(0);
```

### useRef\<T\>

Type the ref to match the DOM element or value it will hold:

```typescript
import { useRef, useEffect, createElement } from 'specifyjs';
import type { RefObject } from 'specifyjs';

function TextInput() {
  const inputRef: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return createElement('input', { ref: inputRef, type: 'text' });
}
```

### useReducer with Typed Actions

Define a discriminated union for actions:

```typescript
interface State {
  count: number;
  error: string | null;
}

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset'; payload: number }
  | { type: 'error'; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment': return { ...state, count: state.count + 1 };
    case 'decrement': return { ...state, count: state.count - 1 };
    case 'reset':     return { ...state, count: action.payload, error: null };
    case 'error':     return { ...state, error: action.payload };
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0, error: null });
  return createElement('button', {
    onClick: () => dispatch({ type: 'increment' }),
  }, `Count: ${state.count}`);
}
```

## Typing Event Handlers

Event handler props accept standard DOM event types. Type them explicitly for safety:

```typescript
interface FormProps extends Props {
  onSubmit: (value: string) => void;
}

function SearchForm(props: FormProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: Event): void => {
    e.preventDefault();
    props.onSubmit(query);
  };

  const handleInput = (e: Event): void => {
    const target = e.target as HTMLInputElement;
    setQuery(target.value);
  };

  return createElement('form', { onSubmit: handleSubmit },
    createElement('input', { type: 'text', onInput: handleInput, value: query }),
    createElement('button', { type: 'submit' }, 'Search'),
  );
}
```

## Typing Context Values

Provide a concrete type parameter to `createContext`:

```typescript
import { createContext, useContext } from 'specifyjs';
import type { SpecContext } from 'specifyjs';

interface Theme {
  primary: string;
  secondary: string;
  background: string;
}

const ThemeContext: SpecContext<Theme> = createContext<Theme>({
  primary: '#0066cc',
  secondary: '#444',
  background: '#fff',
});

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return createElement('button', {
    style: `background: ${theme.primary}; color: ${theme.background}`,
  }, 'Click me');
}
```

## Typing Custom Hooks

Custom hooks are plain functions. Type the return value explicitly to avoid leaking implementation details:

```typescript
interface UseToggleReturn {
  value: boolean;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
}

function useToggle(initial: boolean = false): UseToggleReturn {
  const [value, setValue] = useState(initial);
  return {
    value,
    toggle: useCallback(() => setValue(v => !v), []),
    setTrue: useCallback(() => setValue(true), []),
    setFalse: useCallback(() => setValue(false), []),
  };
}
```

## Using SpecElement, SpecNode, and SpecChild

These types describe the tree structure:

| Type          | Definition                                                   | Use case                            |
|---------------|--------------------------------------------------------------|-------------------------------------|
| `SpecElement` | `{ $$typeof, type, props, key, ref }`                       | A single element descriptor         |
| `SpecChild`   | `SpecElement \| string \| number \| boolean \| null \| undefined` | One renderable value           |
| `SpecNode`    | `SpecChild \| SpecNode[]`                                    | Any renderable value, including arrays |

Use `SpecNode` as the return type for render functions and `children` props. Use `SpecElement` when you need to inspect or validate a specific element (for example with `isValidElement`):

```typescript
import { isValidElement } from 'specifyjs';
import type { SpecElement, SpecNode } from 'specifyjs';

function renderWithWrapper(node: SpecNode): SpecNode {
  if (isValidElement(node)) {
    const element = node as SpecElement;
    return createElement('div', { className: 'wrapper', key: element.key }, element);
  }
  return node;
}
```

## See Also

- [API Reference: Types](../api/types.md)
- [Core Concepts](./core-concepts.md)
- [Getting Started](./getting-started.md)
