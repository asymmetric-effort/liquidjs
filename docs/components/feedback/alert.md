# Alert

Alert/banner message component with icon, title, message, and optional close and action buttons.

## Import

```typescript
import { Alert } from '@specifyjs/alert';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Alert severity type |
| `title` | `string` | `undefined` | Alert title |
| `message` | `unknown` | `undefined` | Alert message content |
| `children` | `unknown` | `undefined` | Children alias for message |
| `closable` | `boolean` | `false` | Show close button |
| `onClose` | `() => void` | `undefined` | Close callback |
| `icon` | `string` | auto | Custom icon text/emoji (auto-selected by type if omitted) |
| `variant` | `'filled' \| 'outline' \| 'subtle'` | `'subtle'` | Style variant |
| `action` | `{ label: string; onClick: () => void }` | `undefined` | Optional action button |

## Usage

```typescript
import { createElement } from 'specifyjs';
import { Alert } from '@specifyjs/alert';

function App() {
  return createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
    createElement(Alert, {
      type: 'success',
      title: 'Saved',
      message: 'Your changes have been saved successfully.',
      closable: true,
    }),
    createElement(Alert, {
      type: 'error',
      variant: 'filled',
      title: 'Error',
      message: 'Something went wrong.',
      action: { label: 'Retry', onClick: () => console.log('retry') },
    }),
    createElement(Alert, {
      type: 'warning',
      variant: 'outline',
      message: 'Your session will expire in 5 minutes.',
    }),
  );
}
```

## Features

- Four severity types with distinct color schemes: info (blue), success (green), warning (amber), error (red)
- Three style variants: filled (solid background), outline (border only), subtle (light background)
- Auto-selected icon per type (can be overridden)
- Optional title and message content
- Dismissible with close button and `onClose` callback
- Optional action button styled to match the alert theme
- Internal visibility state for dismiss behavior

## Accessibility

- Uses `role="alert"` for screen reader announcements
- Close button includes `aria-label="Close"`
