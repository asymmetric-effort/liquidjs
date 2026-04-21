# LiquidJS

A TypeScript UI framework with 100% feature parity to React.js, built for performance, compatibility, and developer simplicity.

---

## Project Vision

LiquidJS is a declarative, component-based UI framework that mirrors the full React.js API surface while prioritizing:

- **Performance** — Minimal overhead, efficient diffing, fast rendering
- **Browser & device compatibility** — Broad support across modern and legacy browsers
- **Simplicity** — Easy to learn for new developers, intuitive API design
- **Extensibility** — Full plugin/extension ecosystem support matching React's flexibility

## Core Principles

1. **Declarative by default** — Components describe *what* to render, not *how*
2. **Feature parity with React.js** — Every React API has a LiquidJS equivalent
3. **Test-driven development** — All code is written tests-first
4. **Simplicity over cleverness** — Prefer straightforward patterns that new developers can follow

---

## Feature Parity Requirements

### Component Model
- Functional components with full lifecycle support
- Class components (`Component`, `PureComponent`)
- `createElement` / JSX support via a custom JSX factory
- `Fragment`, `StrictMode`, `Suspense`, `Profiler`
- Error boundaries (`componentDidCatch`, `getDerivedStateFromError`)
- `forwardRef`, `memo`, `lazy`
- Portals (`createPortal`)
- Context API (`createContext`, `useContext`, `Provider`, `Consumer`)

### Hooks (complete set)
- `useState`
- `useEffect`
- `useContext`
- `useReducer`
- `useCallback`
- `useMemo`
- `useRef`
- `useImperativeHandle`
- `useLayoutEffect`
- `useDebugValue`
- `useId`
- `useDeferredValue`
- `useTransition`
- `useSyncExternalStore`
- `useInsertionEffect`
- Custom hooks support

### Reconciliation & Rendering
- Virtual DOM with efficient tree diffing algorithm
- Keyed list reconciliation
- Batched state updates
- Concurrent rendering support (React 18+ parity)
- `startTransition`, `useDeferredValue`
- Automatic batching
- Server-side rendering (SSR) support
- Hydration (`hydrateRoot`)
- Streaming SSR

### DOM Interaction
- Synthetic event system with cross-browser normalization
- Event delegation
- Controlled & uncontrolled form components
- Ref system (callback refs, `createRef`, `useRef`)
- `dangerouslySetInnerHTML`
- SVG support
- Web Components interop

### Rendering APIs
- `createRoot` / `hydrateRoot` (React 18+ concurrent API)
- Legacy `render` / `hydrate` for migration support
- `flushSync`
- `unmountComponentAtNode`

### Server APIs
- `renderToString`
- `renderToStaticMarkup`
- `renderToPipeableStream`
- `renderToReadableStream`

### Utilities
- `Children` utilities (`map`, `forEach`, `count`, `only`, `toArray`)
- `cloneElement`
- `isValidElement`
- `createFactory` (legacy, but supported)
- `act` (testing utility)

### Developer Experience
- DevTools integration hooks
- Strict mode with double-render detection
- Meaningful warning and error messages
- TypeScript-first with full type definitions

---

## Architecture

### Module Structure

```
liquidjs/
  src/
    core/           # Virtual DOM, reconciler, scheduler
    components/     # Built-in component types (Fragment, Suspense, etc.)
    hooks/          # All hook implementations
    dom/            # DOM renderer, event system, synthetic events
    server/         # SSR renderers
    context/        # Context API implementation
    shared/         # Shared utilities, types, constants
    devtools/       # DevTools integration
  tests/
    unit/           # Unit tests (vitest)
    integration/    # Integration tests (vitest + jsdom)
    e2e/            # End-to-end tests (playwright)
  types/            # Public TypeScript type definitions
  examples/         # Example applications
```

### Technology Stack

- **Language**: TypeScript (strict mode)
- **Build**: Rollup or esbuild for library bundling
- **Unit/Integration Testing**: Vitest with jsdom
- **E2E Testing**: Playwright
- **Linting**: ESLint with strict TypeScript rules
- **Formatting**: Prettier

---

## Testing Requirements

### Coverage Targets
- **Minimum 98% test coverage** across all modules
- Every public API must have both happy-path and sad-path (error case) tests
- Edge cases must be explicitly tested (null children, deeply nested trees, rapid state updates, etc.)

### Test Categories

1. **Unit tests** — Isolate individual functions and hooks
2. **Integration tests** — Test component trees, reconciliation, event handling with jsdom
3. **E2E tests (Playwright)** — Full browser rendering, user interaction flows, SSR validation

### Test-Driven Development Process
- Write failing tests before implementation
- Tests define the expected API contract
- No feature is considered complete without passing tests at all three levels

---

## SPA Build & Deployment

### Primary Use Case
LiquidJS is designed for building **single-page web applications** that compile to minified/obfuscated JavaScript for high-performance browser execution.

### Build Pipeline
- **Development**: Vite dev server with HMR for instant feedback
- **Production**: Vite/Rollup builds with tree-shaking, minification (Terser/esbuild), and code splitting
- **Output**: Single minified JS bundle + HTML shell, ready for CDN deployment
- Applications should compile to `< 50KB` gzipped including framework overhead

### Performance Requirements
- Applications must render initial content within 100ms on modern hardware
- State updates must reflect in the DOM within a single animation frame
- No unnecessary re-renders — memo, useMemo, useCallback prevent wasted work

---

## Platform Support

### Primary Target
- **Linux AMD64** — First-class support, CI runs here

### Future Targets (planned)
- Linux ARM64
- macOS (Intel + Apple Silicon)
- Windows (x64)

### Browser Compatibility
- Chrome/Chromium (last 2 major versions)
- Firefox (last 2 major versions)
- Safari (last 2 major versions)
- Edge (Chromium-based)
- Mobile Safari (iOS 15+)
- Chrome for Android

---

## Development Guidelines

### Code Style
- TypeScript strict mode (`strict: true` in tsconfig)
- No `any` types unless absolutely necessary (and documented)
- Prefer `const` over `let`, never use `var`
- Named exports over default exports
- Pure functions where possible

### API Design
- Match React's API naming and signatures exactly where possible
- Add LiquidJS-specific extensions as separate named exports
- Deprecation warnings before removing any API
- JSDoc comments on all public APIs

### Supply Chain Integrity
- **Zero runtime dependencies** — The published library has no third-party deps
- Minimize third-party dev dependencies to essential build/test tooling only
- Solve problems inline rather than importing packages
- All algorithms (diffing, scheduling, event normalization) are implemented from scratch
- Dev-only deps (TypeScript, Vitest, Playwright, Rollup) are acceptable since they don't ship to consumers

### Performance Targets
- Virtual DOM diffing must be competitive with React's reconciler
- Memory allocation should be minimized during renders
- Event system should use delegation to reduce listener count
- Bundle size target: < 15KB minified + gzipped for core

### Git Workflow
- Conventional commits (`feat:`, `fix:`, `test:`, `docs:`, `refactor:`, `perf:`, `chore:`)
- All changes require tests
- Feature branches merged via PR
