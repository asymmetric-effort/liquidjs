import { createElement, Fragment } from 'liquidjs';
import { useState, useMemo } from 'liquidjs/hooks';
import { createRoot } from 'liquidjs/dom';
import { HypercubeGraph } from '../../../../components/viz/graph/src/HypercubeGraph';
import { VizWrapper } from '../../../../components/viz/wrapper/src/VizWrapper';
import { generatePalette } from '../../../../components/viz/graph/src/hypercube';
import type { LegendItem } from '../../../../components/viz/wrapper/src/VizWrapper';

function App() {
  const [dimension, setDimension] = useState(4);
  const [speed, setSpeed] = useState(8);
  const [perspective, setPerspective] = useState(25);
  const [showLabels, setShowLabels] = useState(false);
  const [radius, setRadius] = useState(10);

  const vertexCount = 1 << dimension;
  const edgeCount = dimension * (1 << (dimension - 1));
  const colors = useMemo(() => generatePalette(vertexCount), [vertexCount]);

  const legend: LegendItem[] = useMemo(() => {
    if (vertexCount > 16) return [];
    return colors.map((c, i) => ({
      label: i.toString(2).padStart(dimension, '0'),
      color: c,
    }));
  }, [colors, vertexCount, dimension]);

  return createElement(
    'div',
    { className: 'app' },
    createElement(
      VizWrapper,
      {
        title: `${dimension}D Hypercube — ${vertexCount} vertices, ${edgeCount} edges`,
        titlePosition: 'top',
        titleFontSize: '20px',
        legend: legend.length > 0 ? legend : undefined,
        legendPosition: 'bottom',
        legendFontSize: '11px',
        legendGap: 10,
        width: '100%',
        backgroundColor: '#0f172a',
        border: 'none',
        borderRadius: '12px',
        padding: '20px',
        titleColor: '#e2e8f0',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      },
      createElement(HypercubeGraph, {
        dimension,
        width: 600,
        height: 500,
        vertexRadius: radius,
        edgeWidth: 3,
        edgeColor: '#475569',
        vertexColors: colors,
        perspective: perspective / 100,
        rotationSpeed: speed / 1000,
        showLabels,
        backgroundColor: 'transparent',
      }),
    ),

    createElement(
      'div',
      { className: 'controls' },
      createElement(
        'div',
        { className: 'control' },
        createElement('label', null, `Dimension: ${dimension}D`),
        createElement('input', {
          type: 'range',
          min: '2',
          max: '7',
          value: String(dimension),
          onInput: (e: Event) => setDimension(Number((e.target as HTMLInputElement).value)),
        }),
        createElement('span', { className: 'info' }, `${vertexCount} vertices, ${edgeCount} edges`),
      ),
      createElement(
        'div',
        { className: 'control' },
        createElement('label', null, `Rotation speed: ${speed}`),
        createElement('input', {
          type: 'range',
          min: '0',
          max: '30',
          value: String(speed),
          onInput: (e: Event) => setSpeed(Number((e.target as HTMLInputElement).value)),
        }),
      ),
      createElement(
        'div',
        { className: 'control' },
        createElement('label', null, `Perspective: ${perspective}%`),
        createElement('input', {
          type: 'range',
          min: '0',
          max: '60',
          value: String(perspective),
          onInput: (e: Event) => setPerspective(Number((e.target as HTMLInputElement).value)),
        }),
      ),
      createElement(
        'div',
        { className: 'control' },
        createElement('label', null, `Vertex size: ${radius}px`),
        createElement('input', {
          type: 'range',
          min: '4',
          max: '20',
          value: String(radius),
          onInput: (e: Event) => setRadius(Number((e.target as HTMLInputElement).value)),
        }),
      ),
      createElement(
        'div',
        { className: 'control' },
        createElement('label', null,
          createElement('input', {
            type: 'checkbox',
            checked: showLabels,
            onChange: () => setShowLabels((v: boolean) => !v),
          }),
          ' Show binary vertex labels',
        ),
      ),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
