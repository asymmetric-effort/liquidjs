# API Reference

## Core API

| Export | Module | Description |
|--------|--------|-------------|
| `createElement` | `liquidjs` | Create a virtual DOM element |
| `h` | `liquidjs` | Alias for createElement |
| `Fragment` | `liquidjs` | Group children without a wrapper node |
| `createContext` | `liquidjs` | Create a context for shared state |
| `createRef` | `liquidjs` | Create a mutable ref object |
| `forwardRef` | `liquidjs` | Forward refs through components |
| `memo` | `liquidjs` | Memoize a component |
| `lazy` | `liquidjs` | Lazy-load a component (use with Suspense) |
| `isValidElement` | `liquidjs` | Check if a value is a LiquidJS element |
| `cloneElement` | `liquidjs` | Clone an element with merged props |
| `Children` | `liquidjs` | Utilities for the children prop |
| `Component` | `liquidjs` | Base class for class components |
| `PureComponent` | `liquidjs` | Component with shallow prop comparison |
| `startTransition` | `liquidjs` | Mark state updates as non-urgent |
| `act` | `liquidjs` | Testing utility for flushing updates |

## Detailed References

- [Components](components.md) — createElement, Fragment, Context, Refs, memo, lazy, forwardRef
- [Hooks](hooks.md) — All 16 hooks with signatures and examples
- [DOM](dom.md) — Browser rendering APIs
- [Server](server.md) — Static pre-rendering — Build-time HTML generation
- [Types](types.md) — TypeScript type definitions
