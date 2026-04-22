import { createElement } from 'liquidjs';
import { useState, useCallback } from 'liquidjs/hooks';
import { createRoot } from 'liquidjs/dom';
import { NumberSpinner } from '../../../../components/form/number-spinner/src/index.ts';

function App() {
  const [value, setValue] = useState(5);
  const [disabled, setDisabled] = useState(false);
  const [showError, setShowError] = useState(false);

  return createElement(
    'div',
    { className: 'app' },
    createElement('h1', null, 'NumberSpinner'),
    createElement('p', { className: 'subtitle' }, 'Numeric input with increment/decrement buttons and keyboard support'),

    createElement(
      'div',
      { className: 'demo-section' },
      createElement('h2', null, 'Live Preview'),
      createElement(NumberSpinner, {
        value,
        onChange: setValue,
        label: 'Quantity',
        min: 0,
        max: 100,
        step: 1,
        error: showError ? 'Quantity must be positive' : undefined,
        disabled,
      }),
      createElement('div', { className: 'output' }, `Value: ${value}`),

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
      ),
    ),

    createElement(
      'div',
      { className: 'demo-section' },
      createElement('h2', null, 'With Prefix & Suffix'),
      createElement(NumberSpinner, {
        value: 25,
        onChange: () => {},
        label: 'Price',
        prefix: '$',
        min: 0,
        max: 1000,
        step: 5,
      }),
      createElement('div', { style: { height: '12px' } }),
      createElement(NumberSpinner, {
        value: 72,
        onChange: () => {},
        label: 'Weight',
        suffix: 'kg',
        min: 0,
        max: 500,
        step: 0.5,
      }),
    ),

    createElement(
      'div',
      { className: 'demo-section' },
      createElement('h2', null, 'Large Step'),
      createElement(NumberSpinner, {
        value: 50,
        onChange: () => {},
        label: 'Percentage',
        suffix: '%',
        min: 0,
        max: 100,
        step: 10,
      }),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
