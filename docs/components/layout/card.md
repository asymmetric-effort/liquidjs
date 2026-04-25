# Card

Content card with optional image, header (title, subtitle, action slot), body, and footer.

## Import

```ts
import { Card } from 'specifyjs/components/layout/card';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | -- | Card title displayed in the header |
| `subtitle` | `string` | -- | Subtitle shown below the title |
| `headerAction` | `unknown` | -- | Slot rendered at the trailing edge of the header (e.g. an action button) |
| `footer` | `unknown` | -- | Slot rendered as the card footer |
| `image` | `string` | -- | URL for a top image |
| `imageAlt` | `string` | `''` | Alt text for the top image |
| `hoverable` | `boolean` | `false` | Enable hover elevation effect |
| `bordered` | `boolean` | `true` | Show border |
| `shadow` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'sm'` | Shadow level |
| `padding` | `string` | `'16px'` | Inner padding (CSS value) |
| `borderRadius` | `string` | `'8px'` | Border radius (CSS value) |
| `style` | `Record<string, string>` | -- | Extra inline styles |
| `className` | `string` | -- | Extra class name |
| `children` | `unknown` | -- | Body content |

## Usage

```ts
import { createElement } from 'specifyjs/core';
import { Card } from 'specifyjs/components/layout/card';

const card = createElement(
  Card,
  {
    title: 'Project Update',
    subtitle: 'Sprint 14 summary',
    shadow: 'md',
  },
  'The sprint was completed on schedule with all deliverables met.',
);
```

## Variants / Features

### Basic card with body only

```ts
createElement(Card, null, 'Simple body content');
```

### Card with top image

```ts
createElement(
  Card,
  {
    image: '/images/hero.jpg',
    imageAlt: 'Hero banner',
    title: 'Featured Article',
  },
  'Article body text...',
);
```

### Header with action slot

Place a button or icon in the header action area.

```ts
createElement(
  Card,
  {
    title: 'Settings',
    headerAction: createElement('button', null, 'Edit'),
  },
  'Configuration details...',
);
```

### Footer slot

```ts
createElement(
  Card,
  {
    title: 'Invoice',
    footer: createElement('button', null, 'Pay Now'),
  },
  'Invoice line items...',
);
```

### Hoverable card

Adds a pointer cursor and enables the `card--hoverable` CSS class for hover effects.

```ts
createElement(Card, { hoverable: true, title: 'Click me' }, 'Interactive card');
```

### Shadow levels

Four shadow levels: `'none'`, `'sm'`, `'md'`, `'lg'`.

```ts
createElement(Card, { shadow: 'lg' }, 'High elevation card');
```

### Borderless card

```ts
createElement(Card, { bordered: false, shadow: 'md' }, 'No border, just shadow');
```

## Accessibility

- The card renders as a plain `<div>`. No ARIA roles are applied by default.
- When using `image`, an `<img>` element is rendered with the `imageAlt` prop as its `alt` attribute. Always provide meaningful alt text for informative images, or leave it empty for decorative ones.
- If the card is `hoverable` and acts as a link or button, wrap it in an appropriate interactive element or add `role="button"` and keyboard handlers to ensure it is accessible.
- No keyboard shortcuts are added by the Card component itself.
