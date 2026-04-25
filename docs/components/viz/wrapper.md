# VizWrapper

Container component for visualization components with configurable title, legend, and CSS containment for style isolation.

## Import

```typescript
import { VizWrapper } from '@specifyjs/viz-wrapper';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `undefined` | Title text |
| `titlePosition` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Position of the title relative to content |
| `titleAlign` | `'start' \| 'center' \| 'end'` | `'center'` | Title alignment |
| `titleFontSize` | `string` | `'16px'` | Title font size |
| `titleFontWeight` | `string` | `'600'` | Title font weight |
| `titleColor` | `string` | `'#1f2937'` | Title color |
| `legend` | `LegendItem[]` | `undefined` | Legend items |
| `legendPosition` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | Position of the legend relative to content |
| `legendAlign` | `'start' \| 'center' \| 'end'` | `'center'` | Legend alignment |
| `legendFontSize` | `string` | `'12px'` | Legend font size |
| `legendGap` | `number` | `16` | Legend item spacing in px |
| `width` | `string \| number` | `'auto'` | Container width |
| `height` | `string \| number` | `'auto'` | Container height |
| `backgroundColor` | `string` | `'#ffffff'` | Background color |
| `border` | `string` | `'1px solid #e5e7eb'` | Border |
| `borderRadius` | `string` | `'8px'` | Border radius |
| `padding` | `string` | `'16px'` | Padding around the entire wrapper |
| `gap` | `string` | `'12px'` | Gap between title/legend/content |
| `boxShadow` | `string` | `undefined` | Box shadow |
| `fontFamily` | `string` | `'inherit'` | Font family |
| `contain` | `string` | `'layout style paint'` | CSS contain value for isolation |
| `className` | `string` | `undefined` | Extra className on the outer container |
| `style` | `Record<string, string>` | `undefined` | Extra inline style on the outer container |
| `children` | `unknown` | `undefined` | The visualization content |

### LegendItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Legend label text |
| `color` | `string` | -- | Swatch color |
| `dash` | `string` | `undefined` | Dash pattern for line shape (e.g. `'5,3'`) |
| `shape` | `'circle' \| 'square' \| 'line'` | `'circle'` | Swatch shape |

## Usage

```typescript
import { createElement } from 'specifyjs';
import { VizWrapper } from '@specifyjs/viz-wrapper';
import { LineGraph } from '@specifyjs/2D-line-graph';

function App() {
  return createElement(VizWrapper, {
    title: 'Monthly Revenue',
    titlePosition: 'top',
    legend: [
      { label: 'Revenue', color: '#3b82f6', shape: 'line' },
      { label: 'Expenses', color: '#ef4444', shape: 'line', dash: '5,3' },
    ],
    legendPosition: 'bottom',
    width: 800,
    height: 500,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
    createElement(LineGraph, {
      data: [{ x: 1, y: 100 }, { x: 2, y: 200 }, { x: 3, y: 150 }],
      width: 750,
      height: 380,
    }),
  );
}
```

## Features

- Configurable title with positional placement (top, bottom, left, right) and text alignment
- Legend with circle, square, and line swatch shapes (line supports dash patterns)
- Flexible layout: title and legend can be placed on any edge independently
- CSS containment (`contain: layout style paint`) for style isolation from the surrounding DOM
- Row-based sub-layout when title or legend is placed on left/right edges
- Configurable container styling: background, border, border-radius, padding, box shadow
- Content area centered with flex layout, filling available space
