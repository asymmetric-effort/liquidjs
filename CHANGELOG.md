# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-04-25

### Added

#### Visualization Components
- 35 visualization demos in Component Gallery across 5 sections:
  Charts & Graphs (12), Data & Analytics (9), Hierarchical & Relational (9),
  Mathematical (3), 3D & Advanced (2)
- New components: Time-Series, Donut, Histogram, Box Plot, Bubble Chart,
  Lollipop, Waterfall, Funnel, Heat Map, Calendar Heat Map, Gauge, Radar,
  Big Number, Word Cloud, Pivot Table, Matrix, Gantt, Tree Map, Sunburst,
  Sankey, Chord, Partition, Decomposition Tree, Geospatial Map, Vector Field,
  3D Layers
- All visualizations support hover events with visual feedback

#### Security
- `secureFetch` wrapper enforcing HTTPS-only network requests
- Content-Security-Policy and Referrer-Policy headers via `useHead` httpEquiv
- `useHead` httpEquiv support for CSP, Referrer-Policy, Cache-Control
- ReDoS fix in router matchPath (replaced polynomial regex with linear loop)
- Integer overflow fix in protobuf API (bounds check before uint32 cast)
- SHA-pinned all GitHub Actions to verified commit hashes
- CodeQL and Dependabot configured for automated security scanning

#### Framework Features
- Hash-based router: Router, Route, Link, useRouter, useParams, useNavigate
- `useHead` hook for declarative meta tags (title, description, OG, Twitter, httpEquiv)
- `secureFetch` and `assertSecureUrl` for HTTPS enforcement
- `ErrorBoundary` component exported from core
- `createFactory` legacy API

#### Showcase Site
- 7-screen SPA at liquidjs.asymmetric-effort.com
- Getting Started dialog with code examples
- Feature article dialogs with detailed explanations
- Economic Dashboard with SVG bar chart, line graph, box plot
- Dialog overlay UX for all non-home screens
- Copyright banners on JS/CSS build output
- Favicon (blue droplet with gold stripe)
- Post-deployment Playwright verification

#### Tooling
- `liquidjs-cert` Go tool for self-signed certificate generation
- Local HTTPS dev via auto-loaded certs in Vite config
- Pre-commit hook (typecheck + format)
- Pre-push hook (typecheck + format + tests + coverage + security review)

### Fixed
- Text Editor: real WYSIWYG with contentEditable + execCommand
- File Upload: OS file selector via hidden input
- Visualization section crash (missing useEffect import)
- Bar chart rendering (SVG-based)
- Route hooks violation (useMemo called conditionally)
- matchPath root pattern ignoring exact option

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
