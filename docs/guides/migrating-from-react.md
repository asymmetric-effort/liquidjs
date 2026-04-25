# Migrating from React

LiquidJS is designed with React API parity. Most React code works with minimal changes.

## Quick Start

1. Replace imports:

```diff
- import React from 'react';
- import ReactDOM from 'react-dom/client';
+ import { createElement, useState, useEffect } from 'liquidjs';
+ import { createRoot } from 'liquidjs/dom';
```

2. Replace JSX pragma (if not using automatic runtime):

```json
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "liquidjs"
  }
}
```

## API Mapping

| React | LiquidJS | Notes |
|-------|----------|-------|
| `React.createElement` | `createElement` | Identical API |
| `ReactDOM.createRoot` | `createRoot` | from `liquidjs/dom` |
| `ReactDOM.hydrateRoot` | `hydrateRoot` | from `liquidjs/dom` |
| `React.useState` | `useState` | Identical |
| `React.useEffect` | `useEffect` | Identical |
| `React.useTransition` | `useTransition` | Lane-based concurrent |
| `React.useDeferredValue` | `useDeferredValue` | Lane-based concurrent |
| `React.startTransition` | `startTransition` | Identical |
| `ReactDOM.flushSync` | `flushSync` | from `liquidjs/dom` |
| `React.memo` | `memo` | Identical |
| `React.forwardRef` | `forwardRef` | Identical |
| `React.lazy` | `lazy` | Identical |
| `React.createContext` | `createContext` | Identical |
| `React.createFactory` | `createFactory` | Deprecated, supported |
| `renderToString` | `renderToString` | from `liquidjs/server` (build-time only) |
| `renderToPipeableStream` | `renderToPipeableStream` | from `liquidjs/server` (build-time only) |
| `renderToReadableStream` | `renderToReadableStream` | from `liquidjs/server` (build-time only) |

> **Note:** Unlike React, LiquidJS does NOT support server-side rendering at request time. The `liquidjs/server` module is for **static pre-rendering during builds** only. Dynamic content should be fetched client-side via HTTPS.

## Legacy API Support

LiquidJS supports React's legacy rendering API for incremental migration:

```typescript
import { render, hydrate, unmountComponentAtNode } from 'liquidjs/dom';

// Legacy render (React 17 style)
render(element, container);

// Legacy hydrate
hydrate(element, container);

// Legacy unmount
unmountComponentAtNode(container);
```

## Key Differences

### No Default Export
LiquidJS uses named exports exclusively. There is no default `React` object.

### Zero Runtime Dependencies
LiquidJS has no dependencies. All algorithms (diffing, scheduling, event normalization) are implemented from scratch.

### TypeScript-First
All APIs have full TypeScript type definitions. No `@types/` package needed.

### Concurrent Rendering
LiquidJS implements lane-based concurrent rendering with the same priority levels as React 18:
- `SyncLane` for `flushSync`
- `DefaultLane` for normal updates
- `TransitionLane` for `startTransition`/`useTransition`

### SVG Support
SVG elements are rendered with the correct SVG namespace (`createElementNS`).

### Web Components
Custom elements (tags with hyphens) receive complex prop values as DOM properties rather than string attributes.

## What's Not Supported

- React Server Components (RSC)
- `use()` hook (React 19)
- `useOptimistic` (React 19)
- `useFormStatus` / `useFormState` (React 19)
- React Native
