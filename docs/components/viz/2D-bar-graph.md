# BarGraph

2D bar chart SVG component with vertical/horizontal orientation, stacked bars, and grouped bars.

## Import

```typescript
import { BarGraph, useBarGraphScales } from '@liquidjs/2D-bar-graph';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `BarDatum[]` | `[]` | Simple bar data |
| `width` | `number` | `600` | SVG width in pixels |
| `height` | `number` | `400` | SVG height in pixels |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Bar orientation |
| `barColor` | `string` | `'#3b82f6'` | Default bar fill color |
| `barGap` | `number` | `8` | Gap between bars in px |
| `barRadius` | `number` | `4` | Border radius on bar tops |
| `showValues` | `boolean` | `true` | Show value labels on bars |
| `showGrid` | `boolean` | `true` | Show grid lines |
| `gridColor` | `string` | `'#e5e7eb'` | Grid line color |
| `title` | `string` | `undefined` | Chart title |
| `padding` | `number` | `50` | Padding around chart area in px |
| `animate` | `boolean` | `false` | Enable bar grow animation |
| `stacked` | `StackedBarDatum[]` | `undefined` | Stacked bar data (overrides `data`) |
| `grouped` | `boolean` | `false` | Grouped mode for stacked data (side-by-side) |

### BarDatum

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Category label |
| `value` | `number` | Bar value |
| `color` | `string` | Optional bar color |

### StackedBarDatum

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Category label |
| `values` | `{ category: string; value: number; color?: string }[]` | Segment values |

## Usage

### Simple bars

```typescript
import { createElement } from 'liquidjs';
import { BarGraph } from '@liquidjs/2D-bar-graph';

function App() {
  const data = [
    { label: 'Jan', value: 120 },
    { label: 'Feb', value: 200 },
    { label: 'Mar', value: 150 },
    { label: 'Apr', value: 280 },
  ];

  return createElement(BarGraph, {
    data,
    width: 600,
    height: 400,
    title: 'Monthly Sales',
    animate: true,
  });
}
```

### Stacked bars

```typescript
createElement(BarGraph, {
  data: [],
  stacked: [
    { label: 'Q1', values: [{ category: 'A', value: 30 }, { category: 'B', value: 50 }] },
    { label: 'Q2', values: [{ category: 'A', value: 40 }, { category: 'B', value: 60 }] },
  ],
  width: 600,
  height: 400,
});
```

### Grouped bars

```typescript
createElement(BarGraph, {
  data: [],
  stacked: [
    { label: 'Q1', values: [{ category: 'A', value: 30 }, { category: 'B', value: 50 }] },
    { label: 'Q2', values: [{ category: 'A', value: 40 }, { category: 'B', value: 60 }] },
  ],
  grouped: true,
  width: 600,
  height: 400,
});
```

## Hook

```typescript
import { useBarGraphScales } from '@liquidjs/2D-bar-graph';

const scales = useBarGraphScales(itemCount, maxValue, axisLength, categoryAxisLength, barGap);
// scales.valueScale(v), scales.categoryScale(i), scales.barThickness
```

## Features

- Vertical and horizontal bar orientation
- Simple, stacked, and grouped bar modes
- Rounded bar corners with configurable radius
- Value labels on bars (conditionally hidden for small segments)
- Grid lines with dashed styling and "nice" step calculation
- Category and value axis with labels
- Chart title
- CSS keyframe animation for bar grow effect with staggered delay
- Auto-computed scales from data
- 10-color default palette for stacked/grouped segments
- Zero dependencies (pure LiquidJS + SVG)
