# Popover

Positioned popover attached to a trigger element.

## Import

```typescript
import { Popover } from '@specifyjs/popover';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `trigger` | `unknown` | -- | Trigger element slot |
| `content` | `unknown` | -- | Popover content slot |
| `open` | `boolean` | `undefined` | Controlled open state (disables auto-toggle when provided) |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | Placement relative to trigger |
| `offset` | `number` | `4` | Offset from trigger in px |
| `arrow` | `boolean` | `false` | Show an arrow pointing to the trigger |
| `closeOnClickOutside` | `boolean` | `true` | Close when clicking outside the popover |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Callback when open state changes (for controlled mode) |

## Usage

```typescript
import { createElement } from 'specifyjs';
import { Popover } from '@specifyjs/popover';

function App() {
  return createElement(Popover, {
    trigger: createElement('button', null, 'Click me'),
    content: createElement('div', null, 'Popover content here'),
    placement: 'bottom',
    arrow: true,
  });
}
```

## Features

- Four placement options: top, bottom, left, right
- Supports both controlled (`open` prop) and uncontrolled modes
- Optional CSS arrow pointing to the trigger
- Click-outside detection to auto-close
- Configurable offset from the trigger element
- Absolute positioning relative to an inline-block container

## Accessibility

- Trigger responds to click events to toggle the popover
- Click-outside handler allows dismissal without explicit close button
