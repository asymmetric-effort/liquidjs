import { createElement } from 'specifyjs';
import { useState } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { Spinner } from '../../../../components/feedback/spinner/src/index';

function Demo() {
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');

  return createElement(
    'div',
    { className: 'app' },
    createElement('h1', null, 'Spinner Demo'),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Sizes'),
      createElement(
        'div',
        { style: { display: 'flex', gap: '24px', alignItems: 'center' } },
        createElement(Spinner, { size: 'sm', label: 'Small spinner' }),
        createElement(Spinner, { size: 'md', label: 'Medium spinner' }),
        createElement(Spinner, { size: 'lg', label: 'Large spinner' }),
        createElement(Spinner, { size: 56, label: 'Custom 56px spinner' }),
      ),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Colors'),
      createElement(
        'div',
        { style: { display: 'flex', gap: '24px', alignItems: 'center' } },
        createElement(Spinner, { color: '#3b82f6', size: 'lg' }),
        createElement(Spinner, { color: '#ef4444', size: 'lg' }),
        createElement(Spinner, { color: '#22c55e', size: 'lg' }),
        createElement(Spinner, { color: '#f59e0b', size: 'lg' }),
        createElement(Spinner, { color: '#8b5cf6', size: 'lg' }),
      ),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Speeds'),
      createElement(
        'div',
        { className: 'controls' },
        ...(['slow', 'normal', 'fast'] as const).map((s) =>
          createElement('button', {
            key: s,
            onClick: () => setSpeed(s),
            style: { fontWeight: speed === s ? '700' : '400' },
          }, s),
        ),
      ),
      createElement(Spinner, { size: 'lg', speed, label: `${speed} spinner` }),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Custom Thickness'),
      createElement(
        'div',
        { style: { display: 'flex', gap: '24px', alignItems: 'center' } },
        createElement(Spinner, { size: 40, thickness: 2 }),
        createElement(Spinner, { size: 40, thickness: 4 }),
        createElement(Spinner, { size: 40, thickness: 6 }),
      ),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(Demo, null));
