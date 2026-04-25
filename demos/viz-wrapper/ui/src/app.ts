import { createElement } from 'specifyjs';
import { useState } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { VizWrapper } from '../../../../components/viz/wrapper/src/index';

function Demo() {
  const [titlePos, setTitlePos] = useState<'top' | 'bottom' | 'left' | 'right'>('top');
  const [legendPos, setLegendPos] = useState<'top' | 'bottom' | 'left' | 'right'>('bottom');

  const sampleLegend = [
    { label: 'Revenue', color: '#3b82f6', shape: 'circle' as const },
    { label: 'Expenses', color: '#ef4444', shape: 'square' as const },
    { label: 'Profit', color: '#22c55e', shape: 'line' as const },
  ];

  const placeholder = createElement('div', {
    style: { width: '300px', height: '200px', backgroundColor: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' },
  }, 'Chart Area');

  return createElement(
    'div',
    { className: 'app' },
    createElement('h1', null, 'VizWrapper Demo'),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Interactive Layout'),
      createElement(
        'div',
        { className: 'controls' },
        createElement('span', null, 'Title:'),
        ...(['top', 'bottom', 'left', 'right'] as const).map((p) =>
          createElement('button', { key: `t-${p}`, onClick: () => setTitlePos(p), style: { fontWeight: titlePos === p ? '700' : '400' } }, p),
        ),
        createElement('span', { style: { marginLeft: '16px' } }, 'Legend:'),
        ...(['top', 'bottom', 'left', 'right'] as const).map((p) =>
          createElement('button', { key: `l-${p}`, onClick: () => setLegendPos(p), style: { fontWeight: legendPos === p ? '700' : '400' } }, p),
        ),
      ),
      createElement(VizWrapper, {
        title: 'Financial Overview',
        titlePosition: titlePos,
        legend: sampleLegend,
        legendPosition: legendPos,
        width: '100%',
        height: 350,
        children: placeholder,
      }),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Styled Wrapper'),
      createElement(VizWrapper, {
        title: 'Custom Styled',
        titleColor: '#7c3aed',
        titleFontSize: '20px',
        backgroundColor: '#faf5ff',
        border: '2px solid #c4b5fd',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(124,58,237,0.1)',
        legend: [
          { label: 'Series A', color: '#7c3aed' },
          { label: 'Series B', color: '#a78bfa' },
        ],
        width: '100%',
        height: 280,
        children: placeholder,
      }),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Minimal (no title, no legend)'),
      createElement(VizWrapper, {
        width: '100%',
        height: 200,
        padding: '8px',
        border: '1px dashed #d1d5db',
        children: placeholder,
      }),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(Demo, null));
