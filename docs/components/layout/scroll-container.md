# ScrollContainer

Scrollable container with configurable direction, scrollbar visibility, optional inset edge shadows, and padding.

## Import

```ts
import { ScrollContainer } from 'liquidjs/components/layout/scroll-container';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxHeight` | `string` | -- | Maximum height (CSS value) |
| `maxWidth` | `string` | -- | Maximum width (CSS value) |
| `direction` | `'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | Scroll direction. Axes not included are set to `overflow: hidden`. |
| `showScrollbar` | `'auto' \| 'always' \| 'hover' \| 'never'` | `'auto'` | Scrollbar visibility mode |
| `padding` | `string` | -- | Inner padding (CSS value) |
| `shadow` | `boolean` | `false` | Show inset shadow at scroll edges to hint overflow |
| `style` | `Record<string, string>` | -- | Extra inline styles |
| `className` | `string` | -- | Extra class name |
| `children` | `unknown` | -- | Children |

## Usage

```ts
import { createElement } from 'liquidjs/core';
import { ScrollContainer } from 'liquidjs/components/layout/scroll-container';

const scrollable = createElement(
  ScrollContainer,
  { maxHeight: '400px', shadow: true },
  createElement('div', null, 'Long content that overflows...'),
);
```

## Variants / Features

### Vertical scroll (default)

Constrains height and scrolls vertically. Horizontal overflow is hidden.

```ts
createElement(
  ScrollContainer,
  { maxHeight: '300px' },
  ...longContentList,
);
```

### Horizontal scroll

Constrains width and scrolls horizontally. Vertical overflow is hidden.

```ts
createElement(
  ScrollContainer,
  { direction: 'horizontal', maxWidth: '600px' },
  createElement('div', { style: { whiteSpace: 'nowrap', width: '2000px' } }, 'Wide content'),
);
```

### Bidirectional scroll

Allows scrolling in both axes.

```ts
createElement(
  ScrollContainer,
  { direction: 'both', maxHeight: '400px', maxWidth: '600px' },
  largeContent,
);
```

### Edge shadow indicators

When `shadow` is `true`, inset shadows appear on edges where content overflows, providing a visual hint that more content is available.

```ts
createElement(
  ScrollContainer,
  { maxHeight: '200px', shadow: true },
  ...items,
);
```

### Scrollbar visibility

Control when scrollbars appear.

```ts
// Always show thin scrollbars
createElement(ScrollContainer, { maxHeight: '300px', showScrollbar: 'always' }, ...children);

// Hide scrollbars entirely (content is still scrollable)
createElement(ScrollContainer, { maxHeight: '300px', showScrollbar: 'never' }, ...children);

// Thin scrollbar on hover
createElement(ScrollContainer, { maxHeight: '300px', showScrollbar: 'hover' }, ...children);
```

### Custom padding

```ts
createElement(
  ScrollContainer,
  { maxHeight: '400px', padding: '16px' },
  ...children,
);
```

## Accessibility

- ScrollContainer renders a plain `<div>` with overflow styles. No ARIA roles are applied by default.
- The container is natively scrollable, meaning it is keyboard-accessible via standard browser behavior (arrow keys, Page Up/Down, Home/End when focused).
- The `shadow` feature is purely visual and does not affect assistive technology output.
- The `showScrollbar: 'never'` mode hides scrollbars using `scrollbar-width: none` but does not prevent scrolling, so content remains accessible via keyboard and touch.
- No additional keyboard shortcuts are added by the ScrollContainer component itself.
