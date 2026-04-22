# EmptyState

Empty content placeholder with icon, title, description, and call-to-action.

## Import

```typescript
import { EmptyState } from '@liquidjs/empty-state';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `string` | `undefined` | Large icon or emoji displayed at the top |
| `title` | `string` | `undefined` | Title text |
| `description` | `string` | `undefined` | Description text |
| `action` | `{ label: string; onClick: () => void }` | `undefined` | Call-to-action button |
| `image` | `string` | `undefined` | Image URL displayed instead of or above the icon |

## Usage

```typescript
import { createElement } from 'liquidjs';
import { EmptyState } from '@liquidjs/empty-state';

function App() {
  return createElement(EmptyState, {
    icon: '\uD83D\uDCC2',
    title: 'No files yet',
    description: 'Upload your first file to get started.',
    action: {
      label: 'Upload File',
      onClick: () => console.log('upload'),
    },
  });
}
```

## Features

- Centered flexbox layout with vertical stacking
- Optional image element with constrained max dimensions (200x160)
- Large icon/emoji display at 48px font size
- Title with 20px bold text
- Description with muted color and constrained max width (360px)
- Call-to-action button with blue primary styling
- All sections are optional and conditionally rendered
