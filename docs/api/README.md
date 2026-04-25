# API Reference

## Core API

| Export | Module | Description |
|--------|--------|-------------|
| `createElement` | `specifyjs` | Create a virtual DOM element |
| `h` | `specifyjs` | Alias for createElement |
| `Fragment` | `specifyjs` | Group children without a wrapper node |
| `createContext` | `specifyjs` | Create a context for shared state |
| `createRef` | `specifyjs` | Create a mutable ref object |
| `forwardRef` | `specifyjs` | Forward refs through components |
| `memo` | `specifyjs` | Memoize a component |
| `lazy` | `specifyjs` | Lazy-load a component (use with Suspense) |
| `isValidElement` | `specifyjs` | Check if a value is a SpecifyJS element |
| `cloneElement` | `specifyjs` | Clone an element with merged props |
| `Children` | `specifyjs` | Utilities for the children prop |
| `Component` | `specifyjs` | Base class for class components |
| `PureComponent` | `specifyjs` | Component with shallow prop comparison |
| `startTransition` | `specifyjs` | Mark state updates as non-urgent |
| `act` | `specifyjs` | Testing utility for flushing updates |

## Detailed References

- [Components](components.md) — createElement, Fragment, Context, Refs, memo, lazy, forwardRef
- [Hooks](hooks.md) — All 16 hooks with signatures and examples
- [DOM](dom.md) — Browser rendering APIs
- [Server](server.md) — Static pre-rendering — Build-time HTML generation
- [Types](types.md) — TypeScript type definitions
