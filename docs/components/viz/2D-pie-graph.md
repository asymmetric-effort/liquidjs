# PieGraph

2D pie and donut chart SVG component with labels, legend, and configurable styling.

## Import

```typescript
import { PieGraph, computeSlices, describeArc } from '@specifyjs/2D-pie-graph';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `PieSliceDatum[]` | -- | Slice data |
| `width` | `number` | `400` | SVG width in pixels |
| `height` | `number` | `400` | SVG height in pixels |
| `innerRadius` | `number` | `0` | Inner radius for donut mode (0 = pie) |
| `outerRadius` | `number` | auto | Outer radius (auto-fit by default) |
| `padAngle` | `number` | `0.02` | Gap angle between slices in radians |
| `showLabels` | `boolean` | `true` | Show slice labels |
| `showValues` | `boolean` | `true` | Show percentage values |
| `showLegend` | `boolean` | `true` | Show legend |
| `legendPosition` | `'right' \| 'bottom'` | `'right'` | Legend placement |
| `title` | `string` | `undefined` | Chart title |
| `centerLabel` | `string` | `undefined` | Center label (donut mode only) |
| `colors` | `string[]` | auto HSL | Custom color palette |
| `strokeColor` | `string` | `'#fff'` | Slice border color |
| `strokeWidth` | `number` | `2` | Slice border width |

### PieSliceDatum

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Slice label |
| `value` | `number` | Slice value |
| `color` | `string` | Optional slice color |

## Usage

### Pie chart

```typescript
import { createElement } from 'specifyjs';
import { PieGraph } from '@specifyjs/2D-pie-graph';

function App() {
  const data = [
    { label: 'Desktop', value: 55 },
    { label: 'Mobile', value: 35 },
    { label: 'Tablet', value: 10 },
  ];

  return createElement(PieGraph, {
    data,
    width: 500,
    height: 400,
    title: 'Device Usage',
    showLegend: true,
    legendPosition: 'right',
  });
}
```

### Donut chart

```typescript
createElement(PieGraph, {
  data: [
    { label: 'Used', value: 75, color: '#3b82f6' },
    { label: 'Free', value: 25, color: '#e5e7eb' },
  ],
  innerRadius: 60,
  centerLabel: '75%',
  showLegend: false,
  width: 300,
  height: 300,
});
```

## Utility Functions

### `computeSlices(data, options?)`

Computes start/end angles, percentages, and resolved colors for each slice.

```typescript
const slices = computeSlices(data, { padAngle: 0.02, colors: ['#f00', '#0f0'] });
// slices[0].startAngle, slices[0].endAngle, slices[0].percentage, slices[0].color
```

### `describeArc(cx, cy, innerR, outerR, startAngle, endAngle)`

Generates an SVG path `d` string for an arc or annular sector.

## Features

- Pie chart (solid) and donut chart (with inner radius) modes
- Auto-generated HSL color palette or custom colors per slice
- Configurable pad angle for gaps between slices
- Slice labels and percentage values positioned at 65% radius for large slices
- Small slices (less than 5%) labeled outside with connector lines
- Center label for donut mode
- Legend with right or bottom (two-column) placement
- Chart title
- White stroke between slices for visual separation
- Exported utility functions for custom rendering
- Zero dependencies (pure SpecifyJS + SVG)
