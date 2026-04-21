# Hooks Internals

## Hook Linked List

Each function component's fiber stores a linked list of hooks:

```
fiber.memoizedState → Hook₁ → Hook₂ → Hook₃ → null
                       │        │        │
                    useState  useEffect  useRef
```

On each render, `allocateHook()` advances through the list. Hooks must be called in the same order every render.

## Dispatcher Pattern

Hooks are thin functions that delegate to a dispatcher:

```
useState() → resolveDispatcher().useState() → useStateImpl()
```

The dispatcher is installed before rendering a function component and uninstalled after. Calling hooks outside a component body fails because the dispatcher is null.

## State Update Queue

Each `useState`/`useReducer` hook maintains a queue of pending updates:

```typescript
hook.queue = [{ action: 5 }, { action: prev => prev + 1 }]
```

The queue is a **shared mutable array** — the `setState` closure and the re-render both reference the same array. This enables state updates to accumulate between renders.

On re-render, the queue is processed in order and cleared in-place (`queue.length = 0`) to maintain closure reference stability.

## Effect System

Effects are pushed to a per-fiber effect list during render:

```typescript
EffectHook {
  tag: HasEffect | Passive,  // Passive = useEffect, Layout = useLayoutEffect
  create: () => cleanup,
  destroy: cleanup | null,
  deps: [dep1, dep2],
  next: EffectHook | null,
}
```

During commit:
1. Run `destroy` (cleanup) from previous render
2. Run `create` and store returned cleanup as `destroy`

Deps are compared with `Object.is` — if all match, the effect is skipped.

## Re-render Trigger

When `setState`/`dispatch` is called:
1. Update is pushed to the hook's queue
2. `scheduleUpdate` is called with a callback that finds the fiber's root
3. `scheduleRender` fires a microtask that re-renders from the root
4. The component re-executes, processes its queued updates, and produces new output
