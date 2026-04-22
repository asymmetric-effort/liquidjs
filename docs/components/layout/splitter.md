# Splitter

Resizable split pane that renders exactly two child panes separated by a draggable divider bar.

## Import

```ts
import { Splitter } from 'liquidjs/components/layout/splitter';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Split direction. Horizontal creates left/right panes; vertical creates top/bottom panes. |
| `initialSplit` | `number` | `50` | Initial split percentage for the first pane |
| `minSize` | `number` | `50` | Minimum size of either pane in pixels |
| `maxSize` | `number` | -- | Maximum size of the first pane in pixels |
| `dividerSize` | `number` | `6` | Divider bar width (horizontal) or height (vertical) in pixels |
| `style` | `Record<string, string>` | -- | Extra inline styles for the container |
| `className` | `string` | -- | Extra class name |
| `children` | `unknown[]` | -- | Exactly two children |

## Usage

```ts
import { createElement } from 'liquidjs/core';
import { Splitter } from 'liquidjs/components/layout/splitter';

const splitView = createElement(
  Splitter,
  { direction: 'horizontal', initialSplit: 30 },
  createElement('div', null, 'Left pane (sidebar)'),
  createElement('div', null, 'Right pane (main content)'),
);
```

## Variants / Features

### Horizontal split (default)

Creates side-by-side left and right panes.

```ts
createElement(
  Splitter,
  { initialSplit: 50 },
  createElement('div', null, 'Left'),
  createElement('div', null, 'Right'),
);
```

### Vertical split

Creates top and bottom panes.

```ts
createElement(
  Splitter,
  { direction: 'vertical', initialSplit: 60 },
  createElement('div', null, 'Top'),
  createElement('div', null, 'Bottom'),
);
```

### Constrained sizing

Set minimum and maximum pane sizes to prevent collapsing or over-expanding.

```ts
createElement(
  Splitter,
  { minSize: 100, maxSize: 400, initialSplit: 30 },
  createElement('div', null, 'Sidebar'),
  createElement('div', null, 'Content'),
);
```

### Custom divider size

```ts
createElement(
  Splitter,
  { dividerSize: 2, initialSplit: 50 },
  createElement('div', null, 'Pane A'),
  createElement('div', null, 'Pane B'),
);
```

## Accessibility

- The divider element has `role="separator"` to identify it as a structural boundary between panes.
- `aria-orientation` is set on the divider: `"vertical"` for horizontal splits (the divider itself is a vertical bar) and `"horizontal"` for vertical splits.
- Resizing is performed via mouse drag (mousedown/mousemove/mouseup). During a drag, the document cursor changes to `col-resize` or `row-resize` and text selection is disabled.
- The component does not currently implement keyboard-based resizing. For full accessibility, consider adding arrow key handlers on the divider to adjust the split percentage incrementally.
