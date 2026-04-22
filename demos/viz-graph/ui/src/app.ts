import { createElement } from 'liquidjs';
import { useState } from 'liquidjs/hooks';
import { createRoot } from 'liquidjs/dom';
import { HypercubeGraph } from '../../../../components/viz/graph/src/index';

function Demo() {
  const [dimension, setDimension] = useState(4);
  const [showLabels, setShowLabels] = useState(false);
  const [speed, setSpeed] = useState(0.008);

  return createElement(
    'div',
    { className: 'app' },
    createElement('h1', null, 'Hypercube Graph Demo'),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Interactive Hypercube'),
      createElement(
        'div',
        { className: 'controls' },
        createElement('span', null, 'Dimension:'),
        ...([2, 3, 4, 5, 6] as const).map((d) =>
          createElement('button', { key: String(d), onClick: () => setDimension(d), style: { fontWeight: dimension === d ? '700' : '400' } }, String(d)),
        ),
        createElement('label', null,
          createElement('input', { type: 'checkbox', checked: showLabels, onChange: () => setShowLabels((s: boolean) => !s) }),
          ' Labels',
        ),
        createElement('span', null, 'Speed:'),
        createElement('button', { onClick: () => setSpeed(0), style: { fontWeight: speed === 0 ? '700' : '400' } }, 'Stop'),
        createElement('button', { onClick: () => setSpeed(0.004), style: { fontWeight: speed === 0.004 ? '700' : '400' } }, 'Slow'),
        createElement('button', { onClick: () => setSpeed(0.008), style: { fontWeight: speed === 0.008 ? '700' : '400' } }, 'Normal'),
        createElement('button', { onClick: () => setSpeed(0.02), style: { fontWeight: speed === 0.02 ? '700' : '400' } }, 'Fast'),
      ),
      createElement(
        'div',
        { style: { display: 'flex', justifyContent: 'center' } },
        createElement(HypercubeGraph, {
          dimension,
          width: 500,
          height: 500,
          showLabels,
          rotationSpeed: speed,
          backgroundColor: '#fafafa',
        }),
      ),
      createElement('p', { style: { textAlign: 'center', color: '#6b7280', fontSize: '13px', marginTop: '8px' } },
        `${dimension}D hypercube: ${1 << dimension} vertices, ${dimension * (1 << (dimension - 1))} edges. Drag to rotate.`,
      ),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Custom Styling'),
      createElement(
        'div',
        { style: { display: 'flex', justifyContent: 'center' } },
        createElement(HypercubeGraph, {
          dimension: 3,
          width: 300,
          height: 300,
          vertexRadius: 14,
          edgeWidth: 4,
          edgeColor: '#6366f1',
          vertexColors: ['#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'],
          perspective: 0.4,
          rotationSpeed: 0.005,
        }),
      ),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(Demo, null));
