import { createElement } from 'liquidjs';
import { useState, useCallback } from 'liquidjs/hooks';
import { createRoot } from 'liquidjs/dom';
import { ProgressBar } from '../../../../components/feedback/progress-bar/src/index';

function Demo() {
  const [value, setValue] = useState(45);
  const [animated, setAnimated] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [variant, setVariant] = useState<'bar' | 'circular'>('bar');

  const increment = useCallback(() => setValue((v: number) => Math.min(100, v + 10)), []);
  const decrement = useCallback(() => setValue((v: number) => Math.max(0, v - 10)), []);

  return createElement(
    'div',
    { className: 'app' },
    createElement('h1', null, 'ProgressBar Demo'),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Interactive'),
      createElement(
        'div',
        { className: 'controls' },
        createElement('button', { onClick: decrement }, '-10'),
        createElement('span', null, `${value}%`),
        createElement('button', { onClick: increment }, '+10'),
        createElement('label', null,
          createElement('input', { type: 'checkbox', checked: animated, onChange: () => setAnimated((a: boolean) => !a) }),
          ' Animated',
        ),
        createElement('label', null,
          createElement('input', { type: 'checkbox', checked: indeterminate, onChange: () => setIndeterminate((i: boolean) => !i) }),
          ' Indeterminate',
        ),
        createElement('label', null,
          createElement('input', { type: 'checkbox', checked: variant === 'circular', onChange: () => setVariant((v: string) => v === 'bar' ? 'circular' : 'bar') }),
          ' Circular',
        ),
      ),
      createElement(ProgressBar, { value, animated, indeterminate, variant, showLabel: true, color: '#3b82f6' }),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Bar Variants'),
      createElement('h3', null, '25%'),
      createElement(ProgressBar, { value: 25, showLabel: true }),
      createElement('h3', null, '50% Animated'),
      createElement(ProgressBar, { value: 50, animated: true, showLabel: true }),
      createElement('h3', null, '75% Custom Colors'),
      createElement(ProgressBar, { value: 75, color: '#22c55e', backgroundColor: '#dcfce7', showLabel: true }),
      createElement('h3', null, 'Indeterminate'),
      createElement(ProgressBar, { indeterminate: true }),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Circular Variants'),
      createElement(
        'div',
        { style: { display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' } },
        createElement(ProgressBar, { variant: 'circular', value: 25, showLabel: true, size: 48 }),
        createElement(ProgressBar, { variant: 'circular', value: 60, animated: true, showLabel: true, size: 64, color: '#8b5cf6' }),
        createElement(ProgressBar, { variant: 'circular', value: 90, showLabel: true, size: 80, color: '#ef4444' }),
        createElement(ProgressBar, { variant: 'circular', indeterminate: true, size: 48, color: '#f59e0b' }),
      ),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(Demo, null));
