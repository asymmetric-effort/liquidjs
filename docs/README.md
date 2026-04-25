# LiquidJS Documentation

## Quick Reference

| Topic | Link | Description |
|-------|------|-------------|
| Getting Started | [guides/getting-started.md](guides/getting-started.md) | Install, create your first app, build |
| Core Concepts | [guides/core-concepts.md](guides/core-concepts.md) | Components, JSX, props, state, lifecycle |
| Hooks | [api/hooks.md](api/hooks.md) | All 16 hooks with examples |
| Components API | [api/components.md](api/components.md) | createElement, Fragment, Context, Refs |
| DOM API | [api/dom.md](api/dom.md) | createRoot, hydrate, portals, events |
| Static Pre-rendering | [api/server.md](api/server.md) | renderToString, build-time HTML generation |
| Architecture | [architecture/README.md](architecture/README.md) | Virtual DOM, fiber, reconciler, scheduler |
| Contributing | [contributing/README.md](contributing/README.md) | Development setup, code style, PR process |

## Guides

- [Getting Started](guides/getting-started.md) — Installation and first application
- [Core Concepts](guides/core-concepts.md) — Components, props, state, lifecycle
- [Building SPAs](guides/building-spas.md) — Single-page application patterns
- [Testing](guides/testing.md) — Unit, integration, and E2E testing
- [Production Builds](guides/production-builds.md) — Minification, optimization, deployment

## API Reference

- [Components](api/components.md) — createElement, Fragment, Context, Refs, memo, lazy, forwardRef
- [Hooks](api/hooks.md) — useState, useEffect, useReducer, useMemo, useCallback, useRef, and 10 more
- [DOM](api/dom.md) — createRoot, hydrateRoot, createPortal, flushSync, legacy APIs
- [Server](api/server.md) — renderToString, renderToStaticMarkup, streaming APIs
- [Types](api/types.md) — TypeScript type definitions

## Architecture

- [Overview](architecture/README.md) — High-level system design
- [Virtual DOM](architecture/virtual-dom.md) — Element creation, diffing algorithm
- [Fiber & Reconciler](architecture/fiber-reconciler.md) — Fiber tree, work loop, keyed reconciliation
- [Hooks Internals](architecture/hooks-internals.md) — Hook state, dispatcher, effect system
- [Event System](architecture/event-system.md) — Synthetic events, delegation, normalization

## Contributing

- [Development Setup](contributing/README.md) — Clone, install, run tests
- [Code Style](contributing/code-style.md) — TypeScript conventions, formatting
- [CI/CD](contributing/ci-cd.md) — GitHub Actions, local testing with act
