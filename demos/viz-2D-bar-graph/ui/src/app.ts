import { createElement } from 'specifyjs';
import { useState } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { BarGraph } from '../../../../components/viz/2D-bar-graph/src/index';

const simpleData = [
  { label: 'Jan', value: 65 },
  { label: 'Feb', value: 45 },
  { label: 'Mar', value: 78 },
  { label: 'Apr', value: 52 },
  { label: 'May', value: 90 },
  { label: 'Jun', value: 67 },
];

const stackedData = [
  { label: 'Q1', values: [{ category: 'Product', value: 40, color: '#3b82f6' }, { category: 'Services', value: 25, color: '#22c55e' }, { category: 'Support', value: 15, color: '#f59e0b' }] },
  { label: 'Q2', values: [{ category: 'Product', value: 55, color: '#3b82f6' }, { category: 'Services', value: 30, color: '#22c55e' }, { category: 'Support', value: 20, color: '#f59e0b' }] },
  { label: 'Q3', values: [{ category: 'Product', value: 48, color: '#3b82f6' }, { category: 'Services', value: 35, color: '#22c55e' }, { category: 'Support', value: 18, color: '#f59e0b' }] },
  { label: 'Q4', values: [{ category: 'Product', value: 70, color: '#3b82f6' }, { category: 'Services', value: 40, color: '#22c55e' }, { category: 'Support', value: 22, color: '#f59e0b' }] },
];

function Demo() {
  const [orientation, setOrientation] = useState<'vertical' | 'horizontal'>('vertical');
  const [mode, setMode] = useState<'simple' | 'stacked' | 'grouped'>('simple');
  const [animate, setAnimate] = useState(false);

  return createElement(
    'div',
    { className: 'app' },
    createElement('h1', null, '2D Bar Graph Demo'),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Interactive Bar Graph'),
      createElement(
        'div',
        { className: 'controls' },
        createElement('button', { onClick: () => setOrientation('vertical'), style: { fontWeight: orientation === 'vertical' ? '700' : '400' } }, 'Vertical'),
        createElement('button', { onClick: () => setOrientation('horizontal'), style: { fontWeight: orientation === 'horizontal' ? '700' : '400' } }, 'Horizontal'),
        createElement('span', null, '|'),
        createElement('button', { onClick: () => setMode('simple'), style: { fontWeight: mode === 'simple' ? '700' : '400' } }, 'Simple'),
        createElement('button', { onClick: () => setMode('stacked'), style: { fontWeight: mode === 'stacked' ? '700' : '400' } }, 'Stacked'),
        createElement('button', { onClick: () => setMode('grouped'), style: { fontWeight: mode === 'grouped' ? '700' : '400' } }, 'Grouped'),
        createElement('label', null, createElement('input', { type: 'checkbox', checked: animate, onChange: () => setAnimate((a: boolean) => !a) }), ' Animate'),
      ),
      createElement(
        'div',
        { style: { display: 'flex', justifyContent: 'center' } },
        createElement(BarGraph, {
          data: mode === 'simple' ? simpleData : [],
          stacked: mode !== 'simple' ? stackedData : undefined,
          grouped: mode === 'grouped',
          orientation,
          animate,
          title: 'Revenue by Period',
          width: 650,
          height: 420,
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
        createElement(BarGraph, {
          data: simpleData.map((d, i) => ({ ...d, color: ['#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#8b5cf6'][i] })),
          width: 550,
          height: 350,
          barRadius: 8,
        }),
      ),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(Demo, null));
