# SpecifyJS Documentation

Welcome to the SpecifyJS documentation — a comprehensive guide to building declarative, performant web applications with zero runtime dependencies.

## Quick Start

| Topic | Link | Description |
|-------|------|-------------|
| Getting Started | [guides/getting-started.md](guides/getting-started.md) | Install, create your first app, build |
| Core Concepts | [guides/core-concepts.md](guides/core-concepts.md) | Components, props, state, lifecycle |
| Routing | [guides/routing.md](guides/routing.md) | Hash-based SPA routing |
| Forms | [guides/forms-and-validation.md](guides/forms-and-validation.md) | Controlled inputs, validation |

---

## Part I: Foundations

- [Getting Started](guides/getting-started.md) — Installation, first component, dev server, build
- [Core Concepts](guides/core-concepts.md) — Elements, components, props, state, effects, fragments, keys
- [TypeScript Patterns](guides/typescript.md) — Typing components, hooks, events, and context
- [Styling](guides/styling.md) — Inline styles, CSS classes, theming, dark mode

## Part II: Essential Patterns

- [Routing & Navigation](guides/routing.md) — Router, Route, Link, useRouter, useParams, useNavigate
- [State Management](guides/state-management.md) — useState, useReducer, Context, custom stores
- [Forms & Validation](guides/forms-and-validation.md) — Controlled inputs, validation, multi-step forms
- [Custom Hooks](guides/custom-hooks.md) — Building reusable logic with hooks
- [Meta Tags & SEO](guides/meta-tags.md) — useHead, Open Graph, CSP headers
- [Feature Flags](guides/feature-flags.md) — FeatureFlagProvider, FeatureGate, runtime toggling

## Part III: Advanced Topics

- [Performance Optimization](guides/performance.md) — memo, useMemo, useCallback, profiling
- [Concurrent Rendering](guides/concurrent-rendering.md) — useTransition, useDeferredValue, lanes
- [Code Splitting](guides/code-splitting.md) — lazy(), Suspense, route-based splitting
- [Error Handling](guides/error-handling.md) — ErrorBoundary, recovery, logging
- [Accessibility](guides/accessibility.md) — ARIA, keyboard nav, screen readers, focus management
- [Building SPAs](guides/building-spas.md) — Single-page application architecture

## Part IV: Production

- [Production Builds](guides/production-builds.md) — Minification, tree-shaking, bundle size
- [Deployment](guides/deployment.md) — GitHub Pages, Netlify, Vercel, custom domains
- [Testing](guides/testing.md) — Unit (Vitest), integration (jsdom), E2E (Playwright)
- [Browser Support](guides/browser-support.md) — Compatibility matrix, polyfills
- [Migrating from React](guides/migrating-from-react.md) — API mapping, key differences

## Part V: Troubleshooting

- [Troubleshooting & FAQ](guides/troubleshooting.md) — Common issues, debugging tips, gotchas

---

## API Reference

- [Components](api/components.md) — createElement, Fragment, Context, Refs, memo, lazy, forwardRef
- [Hooks](api/hooks.md) — All 16 hooks with signatures and examples
- [DOM](api/dom.md) — createRoot, hydrateRoot, createPortal, flushSync
- [Server](api/server.md) — renderToString, renderToStaticMarkup, streaming APIs
- [Types](api/types.md) — SpecElement, SpecNode, SpecChild, SpecContext

## Architecture

- [Overview](architecture/README.md) — High-level system design
- [Virtual DOM](architecture/virtual-dom.md) — Element types, diffing, symbols
- [Fiber & Reconciler](architecture/fiber-reconciler.md) — Fiber tree, work loop, keyed reconciliation
- [Hooks Internals](architecture/hooks-internals.md) — Hook state, dispatcher, effect system
- [Event System](architecture/event-system.md) — Synthetic events, delegation, normalization

## Component Library

- [Component Reference](components/README.md) — 62 components across 8 categories
- **Layout**: [Grid](components/layout/grid.md), [FlexContainer](components/layout/flex-container.md), [Card](components/layout/card.md), [Panel](components/layout/panel.md), [Splitter](components/layout/splitter.md), [Tabs](components/layout/tabs.md), [ScrollContainer](components/layout/scroll-container.md)
- **Form**: [TextField](components/form/textfield.md), [Select](components/form/select.md), [Checkbox](components/form/checkbox.md), [Toggle](components/form/toggle.md), [Slider](components/form/slider.md), [DatePicker](components/form/datepicker.md), [TimePicker](components/form/timepicker.md), [ColorPicker](components/form/color-picker.md), [FileUpload](components/form/file-upload.md), [NumberSpinner](components/form/number-spinner.md), [TextEditor](components/form/texteditor.md)
- **Navigation**: [Dropdown](components/nav/dropdown.md), [TreeNav](components/nav/treenav.md), [Accordion](components/nav/accordion.md), [Breadcrumb](components/nav/breadcrumb.md), [Pagination](components/nav/pagination.md), [Stepper](components/nav/stepper.md), [Sidebar](components/nav/sidebar.md), [Toolbar](components/nav/toolbar.md), [Menubar](components/nav/menubar.md)
- **Overlay**: [Modal](components/overlay/modal.md), [Drawer](components/overlay/drawer.md), [Popover](components/overlay/popover.md), [Tooltip](components/overlay/tooltip.md), [Toast](components/overlay/toast.md), [ContextMenu](components/overlay/context-menu.md)
- **Data**: [DataGrid](components/data/data-grid.md), [ListView](components/data/list-view.md), [VirtualScroll](components/data/virtual-scroll.md), [Tag](components/data/tag.md), [Badge](components/data/badge.md), [Avatar](components/data/avatar.md)
- **Feedback**: [ProgressBar](components/feedback/progress-bar.md), [Spinner](components/feedback/spinner.md), [Skeleton](components/feedback/skeleton.md), [Alert](components/feedback/alert.md), [EmptyState](components/feedback/empty-state.md)
- **Media**: [Image](components/media/image.md), [Carousel](components/media/carousel.md), [VideoPlayer](components/media/video-player.md)
- **Visualization**: [VizWrapper](components/viz/wrapper.md), [BarGraph](components/viz/2D-bar-graph.md), [LineGraph](components/viz/2D-line-graph.md), [PieGraph](components/viz/2D-pie-graph.md), [HypercubeGraph](components/viz/graph.md)

## Contributing

- [Development Setup](contributing/README.md) — Clone, install, run tests
- [Code Style](contributing/code-style.md) — TypeScript conventions, formatting
- [CI/CD](contributing/ci-cd.md) — GitHub Actions, testing with act
