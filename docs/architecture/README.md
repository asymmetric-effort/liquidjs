# Architecture

LiquidJS follows a three-phase rendering architecture similar to React's Fiber architecture.

## System Overview

```
createElement()     Fiber Tree        DOM
     │                  │               │
     ▼                  ▼               ▼
  VNode ──► Reconciler ──► Work Loop ──► Commit ──► Browser
              (diff)      (begin/       (mutate
               │           complete)     real DOM)
               ▼
          Effect Queue ──► Run Effects
```

## Phases

### 1. Begin Phase (top-down)
Walk the fiber tree, rendering components, reconciling children, and building the new fiber tree.

### 2. Complete Phase (bottom-up)
Create/update DOM nodes for host fibers. Build the DOM subtree bottom-up.

### 3. Commit Phase
Apply all DOM mutations atomically, attach refs, run lifecycle methods and effects.

## Key Modules

| Module | Location | Responsibility |
|--------|----------|----------------|
| Types | `src/shared/types.ts` | Core type definitions, fiber tags, effect flags |
| createElement | `src/core/create-element.ts` | Virtual element creation |
| Fiber | `src/core/fiber.ts` | Fiber node creation, work-in-progress cloning |
| Reconciler | `src/core/reconciler.ts` | Two-pass keyed diffing algorithm |
| Scheduler | `src/core/scheduler.ts` | Batched updates, microtask scheduling |
| Hook State | `src/hooks/hook-state.ts` | Hook linked list, effect queue, deps comparison |
| Dispatcher | `src/hooks/dispatcher.ts` | Concrete hook implementations |
| Work Loop | `src/dom/work-loop.ts` | Begin/complete/commit phases, DOM mutations |
| Events | `src/dom/synthetic-event.ts` | Cross-browser event normalization |

## Detailed Architecture

- [Virtual DOM](virtual-dom.md) — Element creation and tree structure
- [Fiber & Reconciler](fiber-reconciler.md) — Diffing and tree updates
- [Hooks Internals](hooks-internals.md) — How hooks work under the hood
- [Event System](event-system.md) — Synthetic event delegation
