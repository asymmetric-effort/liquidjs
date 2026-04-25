# HypercubeGraph

Hypercube graph visualization component for SpecifyJS. Renders an N-dimensional hypercube as an SVG with colored vertex balls and heavy black edges.

## Import

```typescript
import { HypercubeGraph } from '@specifyjs/graph';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dimension` | `number` | `4` | Hypercube dimension (2-8) |
| `width` | `number` | `600` | SVG width in px |
| `height` | `number` | `600` | SVG height in px |
| `vertexRadius` | `number` | `10` | Ball radius in px |
| `edgeWidth` | `number` | `3` | Edge stroke width |
| `edgeColor` | `string` | `'#111'` | Edge color |
| `vertexColors` | `string[] \| 'auto'` | `'auto'` | Vertex colors (auto generates a palette) |
| `perspective` | `number` | `0.25` | Perspective strength (0 = orthographic) |
| `rotationSpeed` | `number` | `0.008` | Radians/frame (0 = static) |
| `showLabels` | `boolean` | `false` | Show binary vertex labels |
| `backgroundColor` | `string` | `'transparent'` | SVG background |
| `scale` | `number` | auto | Coordinate scale factor (auto-fit by default) |

## Usage

```typescript
import { createElement } from 'specifyjs';
import { HypercubeGraph } from '@specifyjs/graph';

function App() {
  return createElement(HypercubeGraph, {
    dimension: 4,          // tesseract
    width: 600,
    height: 600,
    vertexRadius: 12,
    edgeWidth: 3,
    edgeColor: '#111',
    vertexColors: 'auto',
    perspective: 0.25,
    rotationSpeed: 0.008,
    showLabels: true,
  });
}
```

## Hook

```typescript
import { useHypercube } from '@specifyjs/graph';

const { data, angles, setAngles } = useHypercube({
  dimension: 4,
  rotationSpeed: 0.01,
});
// data.vertices, data.edges available for custom rendering
```

## Features

- Configurable dimension (2D square through 8D hypercube)
- Auto-rotation with configurable speed per plane pair
- Mouse-drag rotation for interactive exploration
- Perspective or orthographic projection
- Depth-sorted rendering via painter's algorithm
- Depth-based opacity and vertex scaling for 3D effect
- Custom vertex colors or auto-generated palette
- Optional binary vertex labels
- Zero dependencies (pure SpecifyJS + SVG)
