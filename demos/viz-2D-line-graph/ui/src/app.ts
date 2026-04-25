import { createElement } from 'specifyjs';
import { useState, useCallback } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { LineGraph } from '../../../../components/viz/2D-line-graph/src/index';

const sampleData = [
  { x: 0, y: 4 }, { x: 1, y: 7 }, { x: 2, y: 5 },
  { x: 3, y: 12 }, { x: 4, y: 9 }, { x: 5, y: 15 },
  { x: 6, y: 11 }, { x: 7, y: 18 }, { x: 8, y: 14 },
  { x: 9, y: 22 }, { x: 10, y: 19 },
];

const series2 = [
  { x: 0, y: 2 }, { x: 1, y: 5 }, { x: 2, y: 8 },
  { x: 3, y: 6 }, { x: 4, y: 11 }, { x: 5, y: 9 },
  { x: 6, y: 14 }, { x: 7, y: 12 }, { x: 8, y: 17 },
  { x: 9, y: 15 }, { x: 10, y: 20 },
];

function Demo() {
  const [showArea, setShowArea] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showPoints, setShowPoints] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [showMulti, setShowMulti] = useState(false);

  return createElement(
    'div',
    { className: 'app' },
    createElement('h1', null, '2D Line Graph Demo'),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Interactive Line Graph'),
      createElement(
        'div',
        { className: 'controls' },
        createElement('label', null, createElement('input', { type: 'checkbox', checked: showArea, onChange: () => setShowArea((a: boolean) => !a) }), ' Area'),
        createElement('label', null, createElement('input', { type: 'checkbox', checked: showGrid, onChange: () => setShowGrid((g: boolean) => !g) }), ' Grid'),
        createElement('label', null, createElement('input', { type: 'checkbox', checked: showPoints, onChange: () => setShowPoints((p: boolean) => !p) }), ' Points'),
        createElement('label', null, createElement('input', { type: 'checkbox', checked: animate, onChange: () => setAnimate((a: boolean) => !a) }), ' Animate'),
        createElement('label', null, createElement('input', { type: 'checkbox', checked: showMulti, onChange: () => setShowMulti((m: boolean) => !m) }), ' Multi-line'),
      ),
      createElement(
        'div',
        { style: { display: 'flex', justifyContent: 'center' } },
        createElement(LineGraph, {
          data: sampleData,
          width: 650,
          height: 400,
          showArea,
          showGrid,
          showPoints,
          animate,
          title: 'Monthly Growth',
          xLabel: 'Month',
          yLabel: 'Value',
          multiLine: showMulti ? [{ data: series2, color: '#ef4444', label: 'Series B' }] : undefined,
        }),
      ),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Custom Colors'),
      createElement(
        'div',
        { style: { display: 'flex', justifyContent: 'center' } },
        createElement(LineGraph, {
          data: sampleData,
          width: 500,
          height: 300,
          lineColor: '#8b5cf6',
          pointColor: '#7c3aed',
          showArea: true,
          areaColor: 'rgba(139,92,246,0.12)',
        }),
      ),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Minimal (no grid, no points)'),
      createElement(
        'div',
        { style: { display: 'flex', justifyContent: 'center' } },
        createElement(LineGraph, {
          data: sampleData,
          width: 500,
          height: 250,
          showGrid: false,
          showPoints: false,
          lineWidth: 3,
          lineColor: '#22c55e',
        }),
      ),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(Demo, null));
