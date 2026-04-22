# ProgressBar

Progress indicator with bar and circular variants, supporting determinate and indeterminate modes.

## Import

```typescript
import { ProgressBar } from '@liquidjs/progress-bar';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `0` | Current progress value (0 to max) |
| `max` | `number` | `100` | Maximum value |
| `color` | `string` | `'#3b82f6'` | Fill color |
| `backgroundColor` | `string` | `'#e5e7eb'` | Track background color |
| `height` | `string` | `'8px'` | Bar height (CSS value) |
| `showLabel` | `boolean` | `false` | Show percentage label |
| `animated` | `boolean` | `false` | Enable shimmer animation on the filled portion |
| `variant` | `'bar' \| 'circular'` | `'bar'` | Display variant |
| `size` | `number \| string` | `48` (circular) / `'8px'` (bar) | Size for circular variant (px) or bar height shorthand |
| `indeterminate` | `boolean` | `false` | Indeterminate mode with animation |

## Usage

```typescript
import { createElement } from 'liquidjs';
import { ProgressBar } from '@liquidjs/progress-bar';

function App() {
  return createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
    // Determinate bar
    createElement(ProgressBar, { value: 65, showLabel: true }),
    // Indeterminate bar
    createElement(ProgressBar, { indeterminate: true, color: '#22c55e' }),
    // Circular variant
    createElement(ProgressBar, { value: 75, variant: 'circular', size: 64, showLabel: true }),
    // Animated shimmer
    createElement(ProgressBar, { value: 50, animated: true }),
  );
}
```

## Features

- Bar variant with rounded track and fill, smooth width transition
- Circular variant using SVG with stroke-dasharray for arc rendering
- Determinate mode showing exact progress percentage
- Indeterminate mode with sliding/spinning animation
- Shimmer animation effect via CSS gradient slide
- Percentage label display (above bar or beside circle)
- Configurable colors for fill and track
- Unique animation IDs via `useId` to avoid CSS conflicts

## Accessibility

- Uses `role="progressbar"` on the container
- Includes `aria-valuenow`, `aria-valuemin="0"`, and `aria-valuemax="100"`
- `aria-valuenow` is omitted in indeterminate mode
