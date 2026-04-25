# Badge

Count or dot indicator, positioned as an overlay or rendered inline.

## Import

```typescript
import { Badge } from '@specifyjs/badge';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | `undefined` | Numeric count to display |
| `max` | `number` | `undefined` | Maximum count before showing "N+" |
| `dot` | `boolean` | `false` | Show a dot instead of a count |
| `color` | `string` | `'#ef4444'` | Badge color |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size preset |
| `variant` | `'solid' \| 'outline'` | `'solid'` | Visual variant |
| `children` | `unknown` | `undefined` | Child element to overlay the badge on |

## Usage

```typescript
import { createElement } from 'specifyjs';
import { Badge } from '@specifyjs/badge';

// Overlay mode: badge on top-right of children
function NotificationIcon() {
  return createElement(Badge, { count: 5, max: 99 },
    createElement('span', null, 'Inbox'),
  );
}

// Inline mode: standalone badge
function StatusDot() {
  return createElement(Badge, { dot: true, color: '#22c55e' });
}
```

## Features

- Two rendering modes: overlay (with children) and inline (standalone)
- Numeric count display with optional max cap (e.g., "99+")
- Dot mode for simple status indicators without text
- Three size presets: sm, md, lg
- Solid and outline visual variants
- Overlay badge positioned at top-right with `translate(50%, -50%)`
- Badge hidden when count is 0 or null and not in dot mode

## Accessibility

- Uses `aria-label` with descriptive text: `"notification"` for dots, `"count {N}"` for numeric badges
