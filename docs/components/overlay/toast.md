# Toast

Notification system with toaster factory, container, and hook.

## Import

```typescript
import { createToaster, ToastContainer, useToast } from '@specifyjs/toast';
```

## Props

### ToasterConfig

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left' \| 'top-center' \| 'bottom-center'` | `'top-right'` | Position of the toast stack |
| `maxToasts` | `number` | `5` | Maximum visible toasts |
| `defaultDuration` | `number` | `4000` | Default auto-dismiss duration in ms |

### ToastOptions

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Toast type for styling |
| `duration` | `number` | `4000` | Duration in ms before auto-dismiss (0 = persistent) |
| `action` | `{ label: string; onClick: () => void }` | `undefined` | Optional action button |

### ToastContainer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `toaster` | `Toaster` | -- | Toaster instance to render |

## Usage

### Using the `useToast` hook

```typescript
import { createElement } from 'specifyjs';
import { useToast } from '@specifyjs/toast';

function App() {
  const { toast, ToastContainer } = useToast({ position: 'top-right' });

  return createElement('div', null,
    createElement('button', {
      onClick: () => toast('File saved successfully!', { type: 'success' }),
    }, 'Save'),
    createElement(ToastContainer, null),
  );
}
```

### Using the `createToaster` factory

```typescript
import { createElement } from 'specifyjs';
import { createToaster, ToastContainer } from '@specifyjs/toast';

const toaster = createToaster({ position: 'bottom-center', maxToasts: 3 });

// Trigger from anywhere
toaster.toast('Something went wrong', { type: 'error', duration: 0 });
toaster.dismiss(toastId);
toaster.dismissAll();
```

## Features

- Six positioning options for the toast stack
- Four toast types with distinct color schemes: info, success, warning, error
- Auto-dismiss with configurable duration (set to 0 for persistent toasts)
- Configurable maximum visible toast count
- Optional action button on individual toasts
- Slide-in animation with CSS keyframes
- External toaster factory pattern for framework-agnostic usage
- Subscription-based state management for reactive updates

## Accessibility

- Each toast uses `role="alert"` for screen reader announcements
- Dismiss button includes `aria-label="Dismiss toast"`
