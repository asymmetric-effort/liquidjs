# Grid

CSS Grid layout container with declarative column, row, gap, area, and responsive breakpoint support.

## Import

```ts
import { Grid, GridItem } from 'liquidjs/components/layout/grid';
```

## Props

### Grid

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `number \| string` | -- | Number of equal columns or a CSS `grid-template-columns` string |
| `rows` | `string` | -- | CSS `grid-template-rows` value |
| `gap` | `string` | -- | Gap between grid cells (e.g. `'16px'` or `'1rem 2rem'`) |
| `alignItems` | `string` | -- | CSS `align-items` for the grid container |
| `justifyItems` | `string` | -- | CSS `justify-items` for the grid container |
| `minColWidth` | `string` | -- | When set, uses `auto-fit` with `minmax(minColWidth, 1fr)` for responsive columns |
| `areas` | `string[]` | -- | Named grid areas (`grid-template-areas` lines) |
| `responsive` | `GridBreakpoint[]` | -- | Responsive breakpoints rendered as inline style overrides |
| `style` | `Record<string, string>` | -- | Extra inline styles |
| `className` | `string` | -- | Extra class name |
| `children` | `unknown` | -- | Children |

### GridItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gridColumn` | `string` | -- | `grid-column` value (e.g. `'span 2'`, `'1 / 3'`) |
| `gridRow` | `string` | -- | `grid-row` value |
| `gridArea` | `string` | -- | `grid-area` name |
| `alignSelf` | `string` | -- | CSS `align-self` |
| `justifySelf` | `string` | -- | CSS `justify-self` |
| `style` | `Record<string, string>` | -- | Extra inline styles |
| `className` | `string` | -- | Extra class name |
| `children` | `unknown` | -- | Children |

### GridBreakpoint

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `minWidth` | `string` | -- | Min-width media query value (e.g. `'768px'`) |
| `columns` | `number \| string` | -- | Column template override at this breakpoint |
| `rows` | `string` | -- | Row template override |
| `gap` | `string` | -- | Gap override |

## Usage

```ts
import { createElement } from 'liquidjs/core';
import { Grid, GridItem } from 'liquidjs/components/layout/grid';

const layout = createElement(
  Grid,
  { columns: 3, gap: '16px' },
  createElement(GridItem, null, 'Cell 1'),
  createElement(GridItem, { gridColumn: 'span 2' }, 'Cell 2 (wide)'),
  createElement(GridItem, null, 'Cell 3'),
);
```

## Variants / Features

### Equal columns by number

Pass an integer to `columns` to create that many equal-width columns using `repeat(N, 1fr)`.

```ts
createElement(Grid, { columns: 4, gap: '12px' }, ...children);
```

### Custom column template

Pass a full CSS string for fine-grained control.

```ts
createElement(Grid, { columns: '200px 1fr 1fr', gap: '8px' }, ...children);
```

### Auto-fit responsive columns

Use `minColWidth` to create a responsive grid that automatically fits as many columns as possible.

```ts
createElement(Grid, { minColWidth: '250px', gap: '16px' }, ...children);
```

### Named grid areas

Define named areas and place items with `gridArea`.

```ts
createElement(
  Grid,
  {
    areas: ['header header', 'sidebar main', 'footer footer'],
    columns: '200px 1fr',
    rows: 'auto 1fr auto',
    gap: '8px',
  },
  createElement(GridItem, { gridArea: 'header' }, 'Header'),
  createElement(GridItem, { gridArea: 'sidebar' }, 'Sidebar'),
  createElement(GridItem, { gridArea: 'main' }, 'Main'),
  createElement(GridItem, { gridArea: 'footer' }, 'Footer'),
);
```

### Alignment

Control cross-axis and main-axis alignment of all items.

```ts
createElement(Grid, { columns: 3, alignItems: 'center', justifyItems: 'stretch' }, ...children);
```

## Accessibility

- Grid renders a plain `<div>` with `display: grid`. It does not add any ARIA roles by default since CSS Grid is a visual layout mechanism, not a semantic structure.
- Use appropriate semantic elements or ARIA landmarks inside grid cells to convey meaning to assistive technologies.
- No keyboard shortcuts are added by the Grid component itself.
