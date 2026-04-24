# Fiber & Reconciler

## Fiber Nodes

Each element in the tree becomes a fiber — a mutable work unit:

```typescript
interface Fiber {
  tag: FiberTag;        // HostComponent, FunctionComponent, ClassComponent, etc.
  type: ComponentType;  // 'div', MyComponent, Fragment symbol
  key: Key;             // Reconciliation identity
  stateNode: unknown;   // DOM node (host) or class instance
  pendingProps: Props;  // New props for this render
  memoizedProps: Props; // Props from last render
  memoizedState: unknown; // Hook linked list (functions) or state (classes)

  return: Fiber | null;  // Parent
  child: Fiber | null;   // First child
  sibling: Fiber | null; // Next sibling
  alternate: Fiber | null; // Previous render's fiber (double buffering)

  effectTag: EffectTag; // Placement, Update, Deletion
}
```

## Double Buffering

LiquidJS maintains two fiber trees:
- **Current** — represents what's on screen
- **Work-in-progress (WIP)** — being built during render

After commit, the WIP becomes the new current tree.

## Reconciliation Algorithm

### Single Child
Direct comparison: same type → reuse fiber, different type → replace.

### Multiple Children (Two-Pass)

**Pass 1 — Linear scan:**
Walk old and new children in order. Match by key. Break on first mismatch.

**Pass 2 — Map lookup:**
Build a Map of remaining old children by key. For each remaining new child, look up a match in the map. Matched fibers are reused; unmatched old fibers are deleted.

### Keyed Diffing

Keys enable O(n) reconciliation of reordered lists. Without keys, LiquidJS falls back to index-based matching (O(n) but may cause unnecessary DOM mutations).

## Effect Tags

- `Placement` — New node, needs DOM insertion
- `Update` — Existing node with changed props
- `Deletion` — Node removed from tree
- `Ref` — Ref needs attaching/detaching

## Lane-Based Priority System

Each fiber has `lanes` and `childLanes` bitmask fields for concurrent rendering:

| Lane | Value | Purpose |
|------|-------|---------|
| `SyncLane` | 1 | `flushSync` — highest priority, synchronous |
| `InputContinuousLane` | 2 | Drag, scroll, hover |
| `DefaultLane` | 4 | Normal `useState`/`useReducer` updates |
| `TransitionLane1/2` | 8/16 | `startTransition` — interruptible, lower priority |
| `IdleLane` | 64 | Background/offscreen work |

### Scheduling

The work loop has two modes:
- **`workLoopSync`** — processes the entire tree without yielding (used by `SyncLane` and `DefaultLane`)
- **`workLoopConcurrent`** — yields to the host after each 5ms frame budget via `shouldYieldToHost()` (used by `TransitionLane` and `IdleLane`)

`ensureRootIsScheduled` inspects `FiberRoot.pendingLanes` and picks the appropriate mode. Higher-priority updates can interrupt in-progress lower-priority work.

### State Update Flow

1. `setState()` calls `requestUpdateLane()` → returns lane based on context (transition, flushSync, or default)
2. `markFiberWithLane()` propagates the lane up the fiber tree via `childLanes`
3. `ensureRootIsScheduled()` schedules sync or concurrent work based on the highest-priority pending lane
4. After commit, completed lanes are cleared from `pendingLanes`
