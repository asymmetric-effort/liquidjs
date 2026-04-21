# Virtual DOM

## Elements

`createElement` produces lightweight VNode objects:

```typescript
{
  $$typeof: LIQUID_ELEMENT_TYPE,  // Symbol — prevents JSON injection
  type: 'div',                    // String for host, function/class for components
  props: { className: 'card' },   // Includes children
  key: null,                      // Reconciliation identity
  ref: null,                      // DOM/instance ref
}
```

## Type Symbols

Each special component type has a unique symbol:
- `LIQUID_FRAGMENT_TYPE` — Fragment (no DOM wrapper)
- `LIQUID_PORTAL_TYPE` — Render into different DOM subtree
- `LIQUID_PROVIDER_TYPE` — Context Provider
- `LIQUID_CONSUMER_TYPE` — Context Consumer
- `LIQUID_FORWARD_REF_TYPE` — Ref forwarding wrapper
- `LIQUID_MEMO_TYPE` — Memoized component wrapper
- `LIQUID_LAZY_TYPE` — Lazy-loaded component
- `LIQUID_SUSPENSE_TYPE` — Suspense boundary

## Children Normalization

Children are normalized during reconciliation:
- `null`, `undefined`, `boolean` → filtered out
- `string`, `number` → text nodes
- Arrays → flattened recursively
- Elements → fiber nodes

## JSX Runtime

The automatic JSX transform (`jsx-runtime.ts`) is a thin wrapper over `createElement` that handles the `key` extraction differently (passed as a separate argument by the compiler).
