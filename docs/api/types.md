# TypeScript Types

SpecifyJS is written in TypeScript strict mode. All public APIs are fully typed.

## Core Types

```typescript
// Element
interface SpecElement<P extends Props = Props> {
  $$typeof: symbol;
  type: ComponentType<P>;
  props: P;
  key: Key;
  ref: Ref;
}

// Valid children
type SpecChild = SpecElement | string | number | boolean | null | undefined;
type SpecNode = SpecChild | SpecNode[];

// Props
type Props = Record<string, unknown> & { children?: SpecNode; key?: Key; ref?: Ref };
type Key = string | number | null;

// Refs
type Ref<T = unknown> = RefCallback<T> | RefObject<T> | null;
type RefCallback<T> = (instance: T | null) => void;
interface RefObject<T> { current: T | null; }

// Components
type FunctionComponent<P extends Props = Props> = (props: P) => SpecNode;
type ComponentType<P extends Props = Props> = FunctionComponent<P> | ClassComponentConstructor<P> | string | symbol;

// Context
interface SpecContext<T> {
  Provider: ComponentType;
  Consumer: ComponentType;
  _currentValue: T;
  displayName?: string;
}
```

## Fiber Types (internal)

```typescript
interface Fiber<P extends Props = Props> {
  tag: FiberTag;
  type: ComponentType<P> | null;
  key: Key;
  ref: Ref;
  stateNode: unknown;
  pendingProps: P;
  memoizedProps: P | null;
  memoizedState: unknown;
  return: Fiber | null;
  child: Fiber | null;
  sibling: Fiber | null;
  alternate: Fiber | null;
  effectTag: EffectTag;
}
```

These internal types are exported for advanced use cases like DevTools integration but are not part of the stable public API.
