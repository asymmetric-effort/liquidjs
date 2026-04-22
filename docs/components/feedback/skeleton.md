# Skeleton

Content placeholder with shimmer animation for loading states.

## Import

```typescript
import { Skeleton } from '@liquidjs/skeleton';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'text' \| 'circular' \| 'rectangular'` | `'text'` | Shape variant |
| `width` | `string \| number` | `'100%'` | Width (CSS value or px number) |
| `height` | `string \| number` | variant-dependent | Height (CSS value or px number) |
| `lines` | `number` | `1` | Number of text lines to render (text variant only) |
| `animated` | `boolean` | `true` | Enable shimmer animation |
| `borderRadius` | `string` | `'4px'` | Border radius (CSS value) |

## Usage

```typescript
import { createElement } from 'liquidjs';
import { Skeleton } from '@liquidjs/skeleton';

function App() {
  return createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
    // Multi-line text skeleton
    createElement(Skeleton, { variant: 'text', lines: 3 }),
    // Circular skeleton (avatar placeholder)
    createElement(Skeleton, { variant: 'circular', width: 48 }),
    // Rectangular skeleton (image placeholder)
    createElement(Skeleton, { variant: 'rectangular', width: '100%', height: 200 }),
  );
}
```

## Features

- Three shape variants: text, circular, rectangular
- Text variant supports multiple lines with the last line rendered at 75% width
- Shimmer animation via CSS gradient slide (can be disabled)
- Configurable dimensions and border radius
- Unique animation keyframe IDs via `useId` to avoid CSS conflicts
- Gray placeholder color (#e5e7eb) with lighter shimmer highlight (#f3f4f6)

## Accessibility

- All skeleton elements are marked `aria-hidden="true"` since they are decorative placeholders
