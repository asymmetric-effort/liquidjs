import { createElement } from 'liquidjs';
import { useState } from 'liquidjs/hooks';
import { createRoot } from 'liquidjs/dom';
import { Splitter } from '../../../../components/layout/splitter/src/index';

function SplitterDemo() {
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [initialSplit, setInitialSplit] = useState(50);
  const [minSize, setMinSize] = useState(50);
  const [dividerSize, setDividerSize] = useState(6);

  const paneStyle = (color: string): Record<string, string> => ({
    padding: '24px',
    backgroundColor: color,
    height: '100%',
    boxSizing: 'border-box',
  });

  return createElement('div', { className: 'demo-app' },
    createElement('h1', null, 'Splitter Component Demo'),

    createElement('div', { className: 'controls' },
      createElement('label', null, 'Direction: ',
        createElement('select', {
          value: direction,
          onChange: (e: Event) => setDirection((e.target as HTMLSelectElement).value as any),
        },
          createElement('option', { value: 'horizontal' }, 'horizontal'),
          createElement('option', { value: 'vertical' }, 'vertical'),
        ),
      ),
      createElement('label', null, 'Initial Split: ',
        createElement('input', {
          type: 'range', min: '10', max: '90', value: String(initialSplit),
          onInput: (e: Event) => setInitialSplit(Number((e.target as HTMLInputElement).value)),
        }),
        createElement('span', null, ` ${initialSplit}%`),
      ),
      createElement('label', null, 'Min Size (px): ',
        createElement('input', {
          type: 'number', value: String(minSize), min: '0', max: '200',
          onInput: (e: Event) => setMinSize(Number((e.target as HTMLInputElement).value)),
        }),
      ),
      createElement('label', null, 'Divider Size (px): ',
        createElement('input', {
          type: 'range', min: '2', max: '20', value: String(dividerSize),
          onInput: (e: Event) => setDividerSize(Number((e.target as HTMLInputElement).value)),
        }),
        createElement('span', null, ` ${dividerSize}px`),
      ),
    ),

    createElement('div', { style: { marginTop: '20px', height: '500px', border: '2px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' } },
      createElement(Splitter, {
        key: `${direction}-${initialSplit}`,
        direction,
        initialSplit,
        minSize,
        dividerSize,
      },
        createElement('div', { style: paneStyle('#eff6ff') },
          createElement('h3', null, 'Pane 1'),
          createElement('p', null, 'Drag the divider bar to resize.'),
          createElement('p', { style: { marginTop: '8px', color: '#6b7280' } }, 'The splitter uses mouse events to track position and update the split percentage in real-time.'),
        ),
        createElement('div', { style: paneStyle('#fef3c7') },
          createElement('h3', null, 'Pane 2'),
          createElement('p', null, 'This pane fills the remaining space.'),
          createElement('p', { style: { marginTop: '8px', color: '#6b7280' } }, 'Min size constraint prevents either pane from being collapsed below the threshold.'),
        ),
      ),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(SplitterDemo, null));
