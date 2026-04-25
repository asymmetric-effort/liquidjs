# @specifyjs/viz-wrapper

A container component for all SpecifyJS visualization components. Provides configurable title, legend, and content areas with positional layout and DOM isolation.

## Features

- **Title** — Positioned top, bottom, left, or right of content
- **Legend** — Positioned independently with circle, square, or line swatches
- **Content isolation** — CSS `contain: layout style paint` prevents style/layout leaks
- **Configurable styling** — Background, border, radius, shadow, padding, font
- **Responsive** — Flexbox layout adapts to container size
- **Zero dependencies** — Pure SpecifyJS + inline styles

## Usage

```typescript
import { createElement } from 'specifyjs';
import { VizWrapper } from '@specifyjs/viz-wrapper';
import { LineGraph } from '@specifyjs/2d-line-graph';

function Chart() {
  return createElement(VizWrapper, {
    title: 'Revenue Over Time',
    titlePosition: 'top',
    legend: [
      { label: 'Revenue', color: '#3b82f6' },
      { label: 'Cost', color: '#ef4444', dash: '5,3', shape: 'line' },
    ],
    legendPosition: 'bottom',
    width: 700,
    border: '1px solid #d1d5db',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
    createElement(LineGraph, { data: [...], width: 600, height: 350 }),
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Title text |
| `titlePosition` | `'top'\|'bottom'\|'left'\|'right'` | `'top'` | Title placement |
| `titleAlign` | `'start'\|'center'\|'end'` | `'center'` | Title text alignment |
| `titleFontSize` | `string` | `'16px'` | Title font size |
| `titleColor` | `string` | `'#1f2937'` | Title color |
| `legend` | `LegendItem[]` | — | Legend entries |
| `legendPosition` | `'top'\|'bottom'\|'left'\|'right'` | `'bottom'` | Legend placement |
| `legendAlign` | `'start'\|'center'\|'end'` | `'center'` | Legend alignment |
| `width` | `string\|number` | `'auto'` | Container width |
| `height` | `string\|number` | `'auto'` | Container height |
| `backgroundColor` | `string` | `'#ffffff'` | Background |
| `border` | `string` | `'1px solid #e5e7eb'` | Border |
| `borderRadius` | `string` | `'8px'` | Corner radius |
| `padding` | `string` | `'16px'` | Inner padding |
| `contain` | `string` | `'layout style paint'` | CSS containment for isolation |
| `children` | — | — | Visualization content |
