# Spinner

Loading spinner indicator rendered as a rotating SVG circle.

## Import

```typescript
import { Spinner } from '@liquidjs/spinner';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg' \| number` | `'md'` | Spinner size: preset name or pixel number |
| `color` | `string` | `'#3b82f6'` | Spinner color |
| `thickness` | `number` | auto | Stroke thickness in pixels (auto-calculated from size) |
| `speed` | `'slow' \| 'normal' \| 'fast'` | `'normal'` | Animation speed (1.2s / 0.75s / 0.45s) |
| `label` | `string` | `'Loading'` | Accessible label for screen readers |

## Usage

```typescript
import { createElement } from 'liquidjs';
import { Spinner } from '@liquidjs/spinner';

function App() {
  return createElement('div', { style: { display: 'flex', gap: '16px', alignItems: 'center' } },
    createElement(Spinner, { size: 'sm' }),
    createElement(Spinner, { size: 'md', color: '#22c55e' }),
    createElement(Spinner, { size: 'lg', speed: 'slow' }),
    createElement(Spinner, { size: 48, thickness: 4, color: '#ef4444' }),
  );
}
```

## Features

- SVG-based circle with stroke-dasharray gap for the spinning effect
- Three size presets: sm (16px), md (24px), lg (40px), plus custom pixel values
- Three speed presets: slow (1.2s), normal (0.75s), fast (0.45s)
- Stroke thickness auto-calculated proportionally from size (or manually set)
- Inline keyframe injection with unique animation ID via `useId`
- Rounded stroke-linecap for smooth visual appearance

## Accessibility

- Uses `role="status"` for live region semantics
- `aria-label` set to the `label` prop (default: "Loading")
- Visually hidden text element contains the label for screen readers
