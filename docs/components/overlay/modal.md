# Modal

Dialog overlay with backdrop, focus trap, and scroll lock.

## Import

```typescript
import { Modal } from '@liquidjs/modal';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | -- | Whether the modal is open |
| `onClose` | `() => void` | -- | Called when the modal requests to close |
| `title` | `string` | `undefined` | Modal title rendered in the header |
| `size` | `'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | Modal width preset (400px / 600px / 800px / 100vw) |
| `closeOnOverlay` | `boolean` | `true` | Close when clicking the overlay backdrop |
| `closeOnEscape` | `boolean` | `true` | Close when pressing Escape |
| `footer` | `unknown` | `undefined` | Footer slot content |
| `showCloseButton` | `boolean` | `true` | Show the X close button in the header |
| `children` | `unknown` | `undefined` | Modal body children |

## Usage

```typescript
import { createElement } from 'liquidjs';
import { Modal } from '@liquidjs/modal';

function App() {
  const [open, setOpen] = useState(false);

  return createElement('div', null,
    createElement('button', { onClick: () => setOpen(true) }, 'Open Modal'),
    createElement(Modal, {
      open,
      onClose: () => setOpen(false),
      title: 'Confirm Action',
      size: 'md',
      footer: createElement('button', { onClick: () => setOpen(false) }, 'Close'),
    },
      createElement('p', null, 'Are you sure you want to proceed?'),
    ),
  );
}
```

## Features

- Four size presets: `sm` (400px), `md` (600px), `lg` (800px), `full` (100vw)
- Animated backdrop overlay with click-to-close support
- Body scroll lock while modal is open
- Focus trap -- focuses the dialog container on open
- Configurable close behavior via Escape key and overlay click
- Optional header with title and close button
- Optional footer slot for action buttons

## Accessibility

- Uses `role="dialog"` and `aria-modal="true"` on the overlay
- Uses `role="document"` on the dialog content container
- Close button includes `aria-label="Close modal"`
- Focus is moved to the dialog when opened
- Escape key dismisses the modal by default
