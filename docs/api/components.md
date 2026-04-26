# Components API

## createElement

```typescript
createElement(type, props, ...children): SpecElement
```

Creates a virtual DOM element. `type` can be a string (`'div'`), function component, or class component.

## Fragment

```typescript
createElement(Fragment, null, child1, child2)
```

Groups children without adding an extra DOM node. JSX shorthand: `<>...</>`.

## Context

### createContext

```typescript
const MyContext = createContext(defaultValue);
```

Creates a context with Provider and Consumer.

### Provider

```typescript
createElement(MyContext.Provider, { value: actualValue }, children)
```

### useContext

```typescript
const value = useContext(MyContext);
```

## Refs

### createRef

```typescript
const ref = createRef<HTMLInputElement>();
// ref.current is null until mounted
```

### forwardRef

```typescript
const FancyInput = forwardRef((props, ref) => {
  return createElement('input', { ref, ...props });
});
```

## Memoization

### memo

```typescript
const MemoComp = memo(MyComponent);
const MemoComp = memo(MyComponent, (prev, next) => prev.id === next.id);
```

### lazy

```typescript
const LazyComp = lazy(() => import('./HeavyComponent'));
// Use with Suspense
```

## Class Components

### Component

```typescript
class MyComp extends Component<Props, State> {
  state = { count: 0 };
  render() { return createElement('div', null, this.state.count); }
  componentDidMount() { }
  componentDidUpdate(prevProps, prevState) { }
  componentWillUnmount() { }
  shouldComponentUpdate(nextProps, nextState) { return true; }
}
```

### PureComponent

Like Component but implements `shouldComponentUpdate` with shallow comparison.

## Utilities

### Children

```typescript
Children.map(children, fn)     // Map over children
Children.forEach(children, fn) // Iterate children
Children.count(children)       // Count renderable children
Children.only(children)        // Assert single element child
Children.toArray(children)     // Flatten to array
```

### cloneElement

```typescript
cloneElement(element, { newProp: 'value' }, newChild)
```

### isValidElement

```typescript
isValidElement(value) // true if SpecifyJS element
```
