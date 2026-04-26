# Virtual DOM

## Elements

`createElement` produces lightweight VNode objects:

```typescript
{
  $$typeof: SPEC_ELEMENT_TYPE,  // Symbol — prevents JSON injection
  type: 'div',                    // String for host, function/class for components
  props: { className: 'card' },   // Includes children
  key: null,                      // Reconciliation identity
  ref: null,                      // DOM/instance ref
}
```

## Type Symbols

Each special component type has a unique symbol:
- `SPEC_FRAGMENT_TYPE` — Fragment (no DOM wrapper)
- `SPEC_PORTAL_TYPE` — Render into different DOM subtree
- `SPEC_PROVIDER_TYPE` — Context Provider
- `SPEC_CONSUMER_TYPE` — Context Consumer
- `SPEC_FORWARD_REF_TYPE` — Ref forwarding wrapper
- `SPEC_MEMO_TYPE` — Memoized component wrapper
- `SPEC_LAZY_TYPE` — Lazy-loaded component
- `SPEC_SUSPENSE_TYPE` — Suspense boundary

## Children Normalization

Children are normalized during reconciliation:
- `null`, `undefined`, `boolean` → filtered out
- `string`, `number` → text nodes
- Arrays → flattened recursively
- Elements → fiber nodes

## JSX Runtime

The automatic JSX transform (`jsx-runtime.ts`) is a thin wrapper over `createElement` that handles the `key` extraction differently (passed as a separate argument by the compiler).
