import { createElement } from 'specifyjs';
import { useState, useCallback } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { RadioGroup } from '../../../../components/form/radio/src/index.ts';

const COLOR_OPTIONS = [
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
  { value: 'purple', label: 'Purple' },
];

function App() {
  const [value, setValue] = useState('red');
  const [disabled, setDisabled] = useState(false);
  const [showError, setShowError] = useState(false);
  const [direction, setDirection] = useState<'vertical' | 'horizontal'>('vertical');

  return createElement(
    'div',
    { className: 'app' },
    createElement('h1', null, 'RadioGroup'),
    createElement('p', { className: 'subtitle' }, 'Radio button group with keyboard navigation'),

    createElement(
      'div',
      { className: 'demo-section' },
      createElement('h2', null, 'Live Preview'),
      createElement(RadioGroup, {
        options: COLOR_OPTIONS,
        value,
        onChange: setValue,
        name: 'color',
        label: 'Favorite Color',
        error: showError ? 'Please select a color' : undefined,
        disabled,
        direction,
      }),
      createElement('div', { className: 'output' }, `Selected: "${value}"`),

      createElement(
        'div',
        { className: 'controls' },
        createElement('label', null,
          createElement('input', { type: 'checkbox', checked: disabled, onChange: () => setDisabled((d: boolean) => !d) }),
          'Disabled',
        ),
        createElement('label', null,
          createElement('input', { type: 'checkbox', checked: showError, onChange: () => setShowError((e: boolean) => !e) }),
          'Show Error',
        ),
        createElement('label', null,
          createElement('input', {
            type: 'checkbox',
            checked: direction === 'horizontal',
            onChange: () => setDirection((d: string) => (d === 'vertical' ? 'horizontal' : 'vertical') as any),
          }),
          'Horizontal',
        ),
      ),
    ),

    createElement(
      'div',
      { className: 'demo-section' },
      createElement('h2', null, 'With Disabled Option'),
      createElement(RadioGroup, {
        options: [
          { value: 'a', label: 'Option A' },
          { value: 'b', label: 'Option B (disabled)', disabled: true },
          { value: 'c', label: 'Option C' },
        ],
        value: 'a',
        onChange: () => {},
        name: 'disabled-demo',
        label: 'Choose',
      }),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
