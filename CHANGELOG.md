# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-04-24

### Added

#### Core Framework
- **Virtual DOM** with efficient tree diffing algorithm
- **Fiber architecture** with double-buffered reconciler and keyed list diffing
- **Component model**: functional components, class components (`Component`, `PureComponent`), `ErrorBoundary`
- **Full hooks system**: `useState`, `useEffect`, `useContext`, `useReducer`, `useCallback`, `useMemo`, `useRef`, `useImperativeHandle`, `useLayoutEffect`, `useDebugValue`, `useId`, `useDeferredValue`, `useTransition`, `useSyncExternalStore`, `useInsertionEffect`
- **Context API**: `createContext`, `useContext`, `Provider`, `Consumer`
- **Special components**: `Fragment`, `StrictMode`, `Suspense`, `Profiler`
- **Utilities**: `createElement`, `cloneElement`, `isValidElement`, `createFactory`, `Children`, `createRef`, `forwardRef`, `memo`, `lazy`, `act`

#### Concurrent Rendering
- **Lane-based priority system** with 8 priority levels (SyncLane, DefaultLane, TransitionLane, IdleLane)
- **Interruptible work loop** with 5ms frame budget and `shouldYieldToHost()`
- **MessageChannel-based scheduling** for time-slicing
- **Working `startTransition()`** and `useTransition()` with actual deferred rendering
- **Working `useDeferredValue()`** returning old value until transition completes
- **Working `flushSync()`** for synchronous rendering bypass

#### DOM Rendering
- `createRoot` / `hydrateRoot` (React 18 concurrent API)
- Legacy `render` / `hydrate` / `unmountComponentAtNode`
- `createPortal` for rendering into external DOM nodes
- **Synthetic event system** with cross-browser normalization (mouse, keyboard, focus, wheel, input, touch)
- **SVG namespace support** via `createElementNS`
- **Web Components interop** — complex props set as DOM properties on custom elements
- **StrictMode double-render detection** on mount
- **DevTools integration** via `notifyDevToolsOfCommit`

#### Static Pre-rendering
- `renderToString` with hydration support
- `renderToStaticMarkup` for static HTML
- `renderToPipeableStream` with progressive chunked output and backpressure handling
- `renderToReadableStream` with chunked Web Streams output

#### Hydration
- `hydrateRoot` reuses existing server-rendered DOM nodes
- Position-based DOM matching (no markers needed)
- Event listeners attached to existing DOM during hydration
- Mismatch fallback — creates new DOM if structure doesn't match

#### Client Libraries
- **REST client** with interceptors, timeout, abort, and `useRest` hook
- **GraphQL client** with `gql` template tag, caching, and `useQuery`/`useMutation` hooks
- **Protobuf/gRPC-Web client** with encode/decode, `defineMessage`, and `useProto` hook

#### Telemetry
- **Metrics**: counter, histogram, gauge with OTLP export
- **Tracing**: distributed tracing with span management, `useTracing` hook, OTLP export

#### Component Library
- 64 reusable components across 8 families: data, feedback, form, layout, media, nav, overlay, viz

#### Build & Tooling
- Zero runtime dependencies
- Rollup build with Terser minification (4KB gzipped core)
- Type declarations for all sub-packages
- ESM and CJS output formats
- Source maps

#### CI/CD
- GitHub Actions: lint, test, build, E2E, Go tools
- Multi-browser E2E testing (Chromium, Firefox, WebKit)
- Bundle size gating (< 15KB gzipped)
- Coverage thresholds (97.9% lines, 98% functions)
- Automated release workflow with npm publish

#### Documentation
- API reference for all modules
- Architecture docs (fiber, reconciler, hooks, events)
- Getting started guide
- React migration guide
- Component library documentation
