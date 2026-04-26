# Feature Flags

SpecifyJS includes a built-in feature flag system based on the Context API. It allows you to gate UI features behind boolean flags, load flag configuration from static JSON, and toggle flags at runtime.

## FeatureFlagProvider

Wrap your application (or a subtree) in `FeatureFlagProvider` to make flags available to all descendants:

```typescript
import { createElement } from 'specifyjs';
import { FeatureFlagProvider } from 'specifyjs/features';
import { createRoot } from 'specifyjs/dom';

const root = createRoot(document.getElementById('root'));

root.render(
  createElement(FeatureFlagProvider, {
    defaults: { darkMode: true, newDashboard: false },
  },
    createElement(App, null),
  ),
);
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `defaults` | `Record<string, boolean>` | Initial flag values applied immediately. |
| `url` | `string` | URL to fetch a JSON object of flag overrides from. |
| `children` | `SpecNode` | Child components that can consume flags. |

When both `defaults` and `url` are provided, defaults are applied first, then remote flags are merged on top once the fetch completes.

## Loading Flags from Static JSON

Point the `url` prop at a static JSON file served over HTTPS:

```typescript
createElement(FeatureFlagProvider, {
  url: 'https://cdn.example.com/flags.json',
  defaults: { betaFeature: false },
},
  createElement(App, null),
);
```

The JSON file should be a flat object mapping flag names to booleans:

```json
{ "betaFeature": true, "newCheckout": false }
```

The provider sanitizes incoming JSON, stripping `__proto__`, `constructor`, and `prototype` keys to prevent prototype pollution.

## FeatureGate Component

`FeatureGate` conditionally renders children based on whether a flag is enabled:

```typescript
import { FeatureGate } from 'specifyjs/features';

function Dashboard() {
  return createElement('div', null,
    createElement(FeatureGate, { flag: 'newDashboard' },
      createElement(NewDashboard, null),
    ),
    createElement(FeatureGate, {
      flag: 'newDashboard',
      fallback: createElement(LegacyWidget, null),
    },
      createElement(NewWidget, null),
    ),
  );
}
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `flag` | `string` | The flag name to check. |
| `children` | `SpecNode` | Rendered when the flag is enabled. |
| `fallback` | `SpecNode` | Rendered when the flag is disabled (defaults to `null`). |

## useFeatureFlags Hook

For programmatic access, use the `useFeatureFlags` hook:

```typescript
import { useFeatureFlags } from 'specifyjs/features';

function SettingsPanel() {
  const { flags, isEnabled, setFlag, loading } = useFeatureFlags();

  if (loading) {
    return createElement('p', null, 'Loading flags...');
  }

  return createElement('div', null,
    createElement('p', null, `Dark mode: ${isEnabled('darkMode')}`),
    createElement('button', {
      onClick: () => setFlag('darkMode', !isEnabled('darkMode')),
    }, 'Toggle Dark Mode'),
  );
}
```

### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `flags` | `Record<string, boolean>` | Current flag state object. |
| `isEnabled` | `(flag: string) => boolean` | Returns `true` if the named flag is enabled. |
| `setFlag` | `(flag: string, enabled: boolean) => void` | Updates a flag at runtime. |
| `loading` | `boolean` | `true` while remote flags are being fetched. |

## Toggling Flags at Runtime

Flags can be changed at runtime using `setFlag`. This triggers a re-render of all components consuming the flag context:

```typescript
function AdminToolbar() {
  const { setFlag, isEnabled } = useFeatureFlags();

  return createElement('label', null,
    createElement('input', {
      type: 'checkbox',
      checked: isEnabled('experimentalEditor'),
      onChange: (e) => setFlag('experimentalEditor', e.target.checked),
    }),
    ' Enable experimental editor',
  );
}
```

Runtime flag changes are not persisted. To persist them, combine `setFlag` with `localStorage` or an API call in your application code.
