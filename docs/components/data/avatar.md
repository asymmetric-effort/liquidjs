# Avatar

User avatar with image, initials fallback, colored circle, and optional status indicator.

## Import

```typescript
import { Avatar } from '@liquidjs/avatar';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | `undefined` | Image source URL |
| `alt` | `string` | `undefined` | Alt text for image |
| `name` | `string` | `undefined` | User's name (used for initials fallback and color generation) |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| number` | `'md'` | Size preset or pixel number |
| `shape` | `'circle' \| 'square'` | `'circle'` | Shape of the avatar |
| `fallbackColor` | `string` | auto | Background color for initials/fallback |
| `status` | `'online' \| 'offline' \| 'busy' \| 'away'` | `undefined` | Online status indicator |
| `statusPosition` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'bottom-right'` | Position of the status dot |

## Usage

```typescript
import { createElement } from 'liquidjs';
import { Avatar } from '@liquidjs/avatar';

function App() {
  return createElement('div', { style: { display: 'flex', gap: '12px' } },
    // Image avatar with status
    createElement(Avatar, {
      src: '/photos/alice.jpg',
      name: 'Alice Johnson',
      size: 'lg',
      status: 'online',
    }),
    // Initials fallback
    createElement(Avatar, {
      name: 'Bob Smith',
      size: 'md',
      status: 'away',
    }),
    // Custom size
    createElement(Avatar, {
      name: 'Carol',
      size: 64,
      shape: 'square',
    }),
  );
}
```

## Features

- Image display with automatic fallback to initials on error
- Initials generated from first and last name parts
- Deterministic background color from user name (consistent across renders)
- Five size presets: xs (24px), sm (32px), md (40px), lg (56px), xl (80px), plus custom pixel values
- Circle and square shape options with proportional border radius
- Status indicator dot with four states: online (green), offline (gray), busy (red), away (yellow)
- Configurable status dot position at any corner
- Status dot scales proportionally with avatar size

## Accessibility

- Uses `role="img"` on the avatar container
- `aria-label` set to `alt`, `name`, or `'avatar'` as fallback
- Status dot includes `aria-label` with the status value
- Initials text marked `aria-hidden="true"` since the container carries the label
