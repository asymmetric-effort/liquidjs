import { createElement } from 'specifyjs';
import { useState } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { PieGraph } from '../../../../components/viz/2D-pie-graph/src/index';

const sampleData = [
  { label: 'Desktop', value: 45 },
  { label: 'Mobile', value: 30 },
  { label: 'Tablet', value: 15 },
  { label: 'Other', value: 10 },
];

function Demo() {
  const [innerRadius, setInnerRadius] = useState(0);
  const [showLabels, setShowLabels] = useState(true);
  const [showValues, setShowValues] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [legendPos, setLegendPos] = useState<'right' | 'bottom'>('right');

  return createElement(
    'div',
    { className: 'app' },
    createElement('h1', null, '2D Pie Graph Demo'),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Interactive Pie / Donut Chart'),
      createElement(
        'div',
        { className: 'controls' },
        createElement('label', null, 'Inner Radius: ',
          createElement('input', { type: 'range', min: '0', max: '80', value: String(innerRadius), onInput: (e: Event) => setInnerRadius(parseInt((e.target as HTMLInputElement).value)) }),
          ` ${innerRadius}px`,
        ),
        createElement('label', null, createElement('input', { type: 'checkbox', checked: showLabels, onChange: () => setShowLabels((l: boolean) => !l) }), ' Labels'),
        createElement('label', null, createElement('input', { type: 'checkbox', checked: showValues, onChange: () => setShowValues((v: boolean) => !v) }), ' Values'),
        createElement('label', null, createElement('input', { type: 'checkbox', checked: showLegend, onChange: () => setShowLegend((l: boolean) => !l) }), ' Legend'),
        createElement('button', { onClick: () => setLegendPos('right'), style: { fontWeight: legendPos === 'right' ? '700' : '400' } }, 'Legend Right'),
        createElement('button', { onClick: () => setLegendPos('bottom'), style: { fontWeight: legendPos === 'bottom' ? '700' : '400' } }, 'Legend Bottom'),
      ),
      createElement(
        'div',
        { style: { display: 'flex', justifyContent: 'center' } },
        createElement(PieGraph, {
          data: sampleData,
          width: 500,
          height: 400,
          innerRadius,
          showLabels,
          showValues,
          showLegend,
          legendPosition: legendPos,
          title: 'Traffic by Device',
          centerLabel: innerRadius > 0 ? 'Total: 100' : undefined,
        }),
      ),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Donut Chart'),
      createElement(
        'div',
        { style: { display: 'flex', justifyContent: 'center' } },
        createElement(PieGraph, {
          data: [
            { label: 'Used', value: 72, color: '#3b82f6' },
            { label: 'Free', value: 28, color: '#e5e7eb' },
          ],
          width: 300,
          height: 300,
          innerRadius: 70,
          showLegend: false,
          centerLabel: '72%',
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
        createElement(PieGraph, {
          data: [
            { label: 'React', value: 40 },
            { label: 'Vue', value: 25 },
            { label: 'Angular', value: 20 },
            { label: 'Svelte', value: 10 },
            { label: 'SpecifyJS', value: 5 },
          ],
          colors: ['#61dafb', '#42b883', '#dd1b16', '#ff3e00', '#3b82f6'],
          width: 450,
          height: 350,
          title: 'Framework Popularity',
        }),
      ),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(Demo, null));
