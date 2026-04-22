# LineGraph

2D line graph SVG component with multi-series support, area fill, and animation.

## Import

```typescript
import { LineGraph, useLineGraphScales } from '@liquidjs/2D-line-graph';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Point[]` | -- | Array of `{ x, y }` data points |
| `width` | `number` | `600` | SVG width in pixels |
| `height` | `number` | `400` | SVG height in pixels |
| `lineColor` | `string` | `'#3b82f6'` | Primary line color |
| `lineWidth` | `number` | `2` | Line stroke width |
| `pointRadius` | `number` | `4` | Data point circle radius |
| `pointColor` | `string` | `'#3b82f6'` | Data point fill color |
| `showPoints` | `boolean` | `true` | Show data point circles |
| `showGrid` | `boolean` | `true` | Show grid lines |
| `showArea` | `boolean` | `false` | Show filled area under the line |
| `areaColor` | `string` | `'rgba(59,130,246,0.15)'` | Area fill color |
| `xLabel` | `string` | `undefined` | X-axis label |
| `yLabel` | `string` | `undefined` | Y-axis label |
| `title` | `string` | `undefined` | Chart title |
| `padding` | `number` | `50` | Padding around chart area in px |
| `animate` | `boolean` | `false` | Enable line draw animation |
| `multiLine` | `LineSeries[]` | `undefined` | Additional line series |

### Point

| Prop | Type | Description |
|------|------|-------------|
| `x` | `number` | X coordinate |
| `y` | `number` | Y coordinate |

### LineSeries

| Prop | Type | Description |
|------|------|-------------|
| `data` | `Point[]` | Series data points |
| `color` | `string` | Line color |
| `label` | `string` | Legend label |

## Usage

```typescript
import { createElement } from 'liquidjs';
import { LineGraph } from '@liquidjs/2D-line-graph';

function App() {
  const data = [
    { x: 0, y: 10 },
    { x: 1, y: 25 },
    { x: 2, y: 18 },
    { x: 3, y: 35 },
    { x: 4, y: 28 },
  ];

  return createElement(LineGraph, {
    data,
    width: 600,
    height: 400,
    showArea: true,
    showGrid: true,
    xLabel: 'Time',
    yLabel: 'Value',
    title: 'Sample Data',
    animate: true,
  });
}
```

### Multi-series example

```typescript
createElement(LineGraph, {
  data: [{ x: 0, y: 10 }, { x: 1, y: 20 }],
  multiLine: [
    { data: [{ x: 0, y: 15 }, { x: 1, y: 12 }], color: '#ef4444', label: 'Series B' },
  ],
  width: 600,
  height: 400,
});
```

## Hook

```typescript
import { useLineGraphScales } from '@liquidjs/2D-line-graph';

const scales = useLineGraphScales(data, 600, 400, 50);
// scales.xScale(value), scales.yScale(value), scales.xTicks, scales.yTicks
```

## Features

- Auto-computed linear scales from data extent
- Grid lines with dashed styling
- X and Y axis with tick marks and labels
- Filled area under the line (polygon-based)
- Multi-series rendering with color-coded legend
- SVG `<animate>` stroke-dashoffset animation for line draw effect
- Data points with optional fade-in animation
- Axis labels and chart title
- Data is auto-sorted by X value before rendering
- Zero dependencies (pure LiquidJS + SVG)
