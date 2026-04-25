# Drawer

Slide-in panel from any edge with optional overlay backdrop.

## Import

```typescript
import { Drawer } from '@specifyjs/drawer';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | -- | Whether the drawer is open |
| `onClose` | `() => void` | -- | Called when the drawer requests to close |
| `position` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` | Edge the drawer slides in from |
| `size` | `string` | `'320px'` | Width (left/right) or height (top/bottom) |
| `title` | `string` | `undefined` | Drawer title |
| `overlay` | `boolean` | `true` | Show overlay backdrop behind the drawer |
| `closeOnOverlay` | `boolean` | `true` | Close when clicking the overlay |
| `closeOnEscape` | `boolean` | `true` | Close on Escape key |
| `children` | `unknown` | `undefined` | Drawer body children |

## Usage

```typescript
import { createElement } from 'specifyjs';
import { Drawer } from '@specifyjs/drawer';

function App() {
  const [open, setOpen] = useState(false);

  return createElement('div', null,
    createElement('button', { onClick: () => setOpen(true) }, 'Open Drawer'),
    createElement(Drawer, {
      open,
      onClose: () => setOpen(false),
      position: 'right',
      size: '400px',
      title: 'Settings',
    },
      createElement('p', null, 'Drawer content goes here.'),
    ),
  );
}
```

## Features

- Slides in from any of the four edges: left, right, top, bottom
- CSS `translate3d` animation with 300ms ease transition
- Optional semi-transparent overlay backdrop
- Body scroll lock while open
- Configurable size via CSS value (px, %, etc.)
- Header with title and close button when `title` is provided
- Visibility managed with open/close animation lifecycle

## Accessibility

- Uses `role="dialog"` and `aria-modal="true"` on the drawer panel
- Close button includes `aria-label="Close drawer"`
- Escape key closes the drawer by default
