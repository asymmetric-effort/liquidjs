# Tag

Rounded pill/chip element with optional remove button, icon, and click interaction.

## Import

```typescript
import { Tag } from '@specifyjs/tag';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Tag label text |
| `color` | `string` | `'#3b82f6'` | Color theme (CSS color or named color) |
| `variant` | `'solid' \| 'outline' \| 'subtle'` | `'subtle'` | Visual variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size preset |
| `removable` | `boolean` | `false` | Show remove/close button |
| `onRemove` | `() => void` | `undefined` | Remove button handler |
| `icon` | `unknown` | `undefined` | Leading icon element |
| `onClick` | `() => void` | `undefined` | Click handler (makes tag interactive) |
| `disabled` | `boolean` | `false` | Disabled state |

## Usage

```typescript
import { createElement } from 'specifyjs';
import { Tag } from '@specifyjs/tag';

function App() {
  return createElement('div', { style: { display: 'flex', gap: '8px' } },
    createElement(Tag, { label: 'React', color: 'blue', variant: 'subtle' }),
    createElement(Tag, {
      label: 'TypeScript',
      color: '#3178c6',
      variant: 'solid',
      removable: true,
      onRemove: () => console.log('removed'),
    }),
    createElement(Tag, {
      label: 'Clickable',
      variant: 'outline',
      onClick: () => console.log('clicked'),
    }),
  );
}
```

## Features

- Three visual variants: solid, outline, and subtle (translucent background)
- Three size presets: sm, md, lg
- Optional remove button with `stopPropagation` to avoid triggering tag click
- Optional leading icon slot
- Click handler turns the tag into an interactive button-like element
- Disabled state with reduced opacity and `pointerEvents: none`
- Supports named CSS colors (red, blue, green, etc.) with hex conversion for subtle backgrounds

## Accessibility

- Uses `role="button"` and `tabIndex="0"` when `onClick` is provided
- Remove button includes `aria-label="Remove {label}"`
- Disabled state uses `aria-disabled="true"`
