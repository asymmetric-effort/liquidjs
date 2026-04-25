# VirtualScroll

Renders only visible items from a large list plus an overscan buffer for performant scrolling.

## Import

```typescript
import { VirtualScroll } from '@specifyjs/virtual-scroll';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `unknown[]` | -- | Full array of items |
| `renderItem` | `(item: unknown, index: number) => unknown` | -- | Render function for a single item |
| `itemHeight` | `number` | -- | Fixed height of each item in pixels |
| `overscan` | `number` | `5` | Extra items rendered above/below the viewport |
| `height` | `string` | -- | Container height (CSS value, e.g. `'400px'` or `'100%'`) |

## Usage

```typescript
import { createElement } from 'specifyjs';
import { VirtualScroll } from '@specifyjs/virtual-scroll';

function App() {
  const items = Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`);

  return createElement(VirtualScroll, {
    items,
    itemHeight: 40,
    height: '400px',
    overscan: 10,
    renderItem: (item, index) =>
      createElement('div', { style: { padding: '8px 12px' } }, item),
  });
}
```

## Features

- Only renders items within the visible viewport plus overscan buffer
- Spacer div maintains correct total scrollbar height
- Absolute positioning for each visible item for smooth scroll performance
- Recalculates visible range on every scroll event
- Configurable overscan count to reduce flicker during fast scrolling
- Fixed item height model for predictable layout calculations
