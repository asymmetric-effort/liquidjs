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
