# SpecifyJS

A declarative TypeScript UI framework built for performance, browser compatibility, and developer simplicity.

## Monorepo Layout

- `core/` — SpecifyJS framework (TypeScript: src, tests, examples, build configs)
- `components/` — Community-contributed reusable components
- `demos/` — Demo applications with TypeScript API servers
- `docs/` — Full documentation tree (see [docs/README.md](docs/README.md))
- `skills/` — Claude skills for SpecifyJS developers
- `.github/workflows/` — CI/CD (4 jobs: lint, test, build, e2e)
- `scripts/` — Repository-wide automation (act-run.sh)

---

## Project Vision

SpecifyJS is a declarative, component-based UI framework prioritizing:

- **Performance** — Minimal overhead, efficient diffing, fast rendering
- **Browser & device compatibility** — Broad support across modern and legacy browsers
- **Simplicity** — Easy to learn for new developers, intuitive API design
- **Extensibility** — Full plugin/extension ecosystem support

## Core Principles

1. **Declarative by default** — Components describe *what* to render, not *how*
2. **Comprehensive API** — Complete hooks, routing, and rendering APIs
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
- Concurrent rendering support
- `startTransition`, `useDeferredValue`
- Automatic batching
- Static pre-rendering (build-time HTML generation, NOT runtime SSR)
- Hydration (`hydrateRoot`) for pre-rendered static HTML

### DOM Interaction
- Synthetic event system with cross-browser normalization
- Event delegation
- Controlled & uncontrolled form components
- Ref system (callback refs, `createRef`, `useRef`)
- `dangerouslySetInnerHTML`
- SVG support
- Web Components interop

### Rendering APIs
- `createRoot` / `hydrateRoot` (concurrent API)
- Legacy `render` / `hydrate` for migration support
- `flushSync`
- `unmountComponentAtNode`

### Static Pre-rendering APIs (Build-time Only — NOT SSR)
- `renderToString` — generates HTML string during build
- `renderToStaticMarkup` — generates HTML without hydration markers
- `renderToPipeableStream` — chunked HTML output to Node.js writable stream
- `renderToReadableStream` — chunked HTML output to Web ReadableStream

> **These APIs must only be used in build scripts and static site generation.**
> They must NOT be used in server request handlers. SpecifyJS is a browser-side
> framework — dynamic content is fetched via HTTPS from API endpoints.

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
specifyjs/
  src/
    core/           # Virtual DOM, reconciler, scheduler
    components/     # Built-in component types (Fragment, Suspense, etc.)
    hooks/          # All hook implementations
    dom/            # DOM renderer, event system, synthetic events
    server/         # Static pre-rendering (build-time HTML generation)
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
3. **E2E tests (Playwright)** — Full browser rendering, user interaction flows, pre-rendering validation

### Test-Driven Development Process
- Write failing tests before implementation
- Tests define the expected API contract
- No feature is considered complete without passing tests at all three levels

---

## SPA Build & Deployment

### Primary Use Case
SpecifyJS is designed for building **single-page web applications** that compile to minified/obfuscated JavaScript for high-performance browser execution.

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
- Use clear, intuitive API naming and signatures
- Add SpecifyJS-specific extensions as separate named exports
- Deprecation warnings before removing any API
- JSDoc comments on all public APIs

### Intellectual Property & Licensing
- **No code may be copied from any project without verifying its license permits such use**
- All algorithms must be implemented from original understanding, not copied from other codebases
- Do not reproduce substantial portions of any copyrighted work (code, documentation, assets)
- When inspired by another project's approach, implement independently and document the design rationale
- All contributions must be original work or properly licensed under MIT-compatible terms
- Any third-party assets (fonts, icons, data) must have explicit permission or compatible licensing

### Supply Chain Integrity
- **Zero runtime dependencies** — The published library has no third-party deps
- Minimize third-party dev dependencies to essential build/test tooling only
- Solve problems inline rather than importing packages
- All algorithms (diffing, scheduling, event normalization) are implemented from scratch
- Dev-only deps (TypeScript, Vitest, Playwright, Rollup) are acceptable since they don't ship to consumers

### Performance Targets
- Virtual DOM diffing must be efficient and performant
- Memory allocation should be minimized during renders
- Event system should use delegation to reduce listener count
- Bundle size target: < 15KB minified + gzipped for core

### Definition of Done

All feature work must meet the following criteria before it is considered complete:

1. **Test Coverage** — >=97.9% unit/integration/e2e test coverage across statements, branches, functions, and lines. Ideally 100%.
2. **Demo Project** — Each component must have a demo project (SPA) that demonstrates the component's entire feature set, with Playwright E2E tests to validate the demo.
3. **Documentation** — Complete documentation covering design/architecture, implementation details, testing strategy, and usage examples.
4. **Linters Pass** — All linting checks (TypeScript strict, ESLint, Prettier) must pass with zero errors.
5. **All Tests Pass** — All unit, integration, and E2E tests must pass with zero failures.

### Git Workflow
- Conventional commits (`feat:`, `fix:`, `test:`, `docs:`, `refactor:`, `perf:`, `chore:`)
- All changes require tests
- Feature branches merged via PR
