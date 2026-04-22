import { createElement } from 'liquidjs';
import { useState, useCallback } from 'liquidjs/hooks';
import { createRoot } from 'liquidjs/dom';
import { Slider } from '../../../../components/form/slider/src/index.ts';

function App() {
  const [value, setValue] = useState(50);
  const [rangeValue, setRangeValue] = useState<[number, number]>([20, 80]);
  const [disabled, setDisabled] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showValue, setShowValue] = useState(true);

  return createElement(
    'div',
    { className: 'app' },
    createElement('h1', null, 'Slider'),
    createElement('p', { className: 'subtitle' }, 'Range slider with marks, ticks, and dual handles'),

    createElement(
      'div',
      { className: 'demo-section' },
      createElement('h2', null, 'Single Slider'),
      createElement(Slider, {
        value,
        onChange: (v: number | [number, number]) => setValue(v as number),
        label: 'Volume',
        min: 0,
        max: 100,
        step: 5,
        showValue,
        error: showError ? 'Value out of range' : undefined,
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
        createElement('label', null,
          createElement('input', { type: 'checkbox', checked: showValue, onChange: () => setShowValue((s: boolean) => !s) }),
          'Show Value Label',
        ),
      ),
    ),

    createElement(
      'div',
      { className: 'demo-section' },
      createElement('h2', null, 'Range Slider'),
      createElement(Slider, {
        value: rangeValue,
        onChange: (v: number | [number, number]) => setRangeValue(v as [number, number]),
        label: 'Price Range',
        min: 0,
        max: 100,
        step: 5,
        range: true,
        showValue: true,
      }),
      createElement('div', { className: 'output' }, `Range: [${rangeValue[0]}, ${rangeValue[1]}]`),
    ),

    createElement(
      'div',
      { className: 'demo-section' },
      createElement('h2', null, 'With Marks'),
      createElement(Slider, {
        value: 50,
        onChange: () => {},
        min: 0,
        max: 100,
        step: 25,
        showTicks: true,
        marks: [
          { value: 0, label: '0%' },
          { value: 25, label: '25%' },
          { value: 50, label: '50%' },
          { value: 75, label: '75%' },
          { value: 100, label: '100%' },
        ],
      }),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
