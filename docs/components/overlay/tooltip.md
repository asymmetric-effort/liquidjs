# Tooltip

Lightweight hover tooltip with configurable placement and delay.

## Import

```typescript
import { Tooltip } from '@specifyjs/tooltip';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | -- | Tooltip text content |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Placement relative to the trigger |
| `delay` | `number` | `200` | Delay in ms before showing |
| `maxWidth` | `string` | `'250px'` | Max width of the tooltip |
| `children` | `unknown` | `undefined` | Trigger element(s) |

## Usage

```typescript
import { createElement } from 'specifyjs';
import { Tooltip } from '@specifyjs/tooltip';

function App() {
  return createElement(Tooltip, {
    text: 'This is a helpful tooltip',
    placement: 'top',
    delay: 300,
  },
    createElement('button', null, 'Hover me'),
  );
}
```

## Features

- Four placement options: top, bottom, left, right
- Configurable show delay to prevent flashing on quick mouse movements
- Fixed positioning calculated from trigger element's bounding rect
- Dark theme styling with rounded corners and arrow indicator
- Automatic word wrapping within configurable max width
- Shows on hover (`mouseenter`) and focus; hides on `mouseleave` and blur
- Timer cleanup on unmount to prevent memory leaks

## Accessibility

- Uses `role="tooltip"` on the tooltip element
- Trigger responds to `focus`/`blur` events for keyboard accessibility
- Tooltip is non-interactive (`pointerEvents: none`)
