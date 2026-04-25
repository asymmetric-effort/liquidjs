import { createElement } from 'specifyjs';
import { useState, useCallback } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { ColorPicker } from '../../../../components/form/color-picker/src/index.ts';

function App() {
  const [color, setColor] = useState('#3b82f6');
  const [disabled, setDisabled] = useState(false);

  return createElement(
    'div',
    { className: 'app' },
    createElement('h1', null, 'ColorPicker'),
    createElement('p', { className: 'subtitle' }, 'Color selection with swatch grid and hex input'),

    createElement(
      'div',
      { className: 'demo-section' },
      createElement('h2', null, 'Live Preview'),
      createElement(ColorPicker, {
        value: color,
        onChange: setColor,
        label: 'Theme Color',
        disabled,
      }),
      createElement('div', { className: 'output' }, `Color: ${color}`),
      createElement('div', {
        style: {
          marginTop: '8px',
          width: '100%',
          height: '40px',
          backgroundColor: color,
          borderRadius: '6px',
          border: '1px solid #d1d5db',
        },
      }),

      createElement(
        'div',
        { className: 'controls' },
        createElement('label', null,
          createElement('input', { type: 'checkbox', checked: disabled, onChange: () => setDisabled((d: boolean) => !d) }),
          'Disabled',
        ),
      ),
    ),

    createElement(
      'div',
      { className: 'demo-section' },
      createElement('h2', null, 'Custom Presets'),
      createElement(ColorPicker, {
        value: '#22c55e',
        onChange: () => {},
        label: 'Brand Colors',
        presets: [
          '#1e40af', '#3b82f6', '#60a5fa',
          '#15803d', '#22c55e', '#86efac',
          '#b91c1c', '#ef4444', '#fca5a5',
        ],
      }),
    ),

    createElement(
      'div',
      { className: 'demo-section' },
      createElement('h2', null, 'No Input Field'),
      createElement(ColorPicker, {
        value: '#ff6600',
        onChange: () => {},
        label: 'Quick Pick',
        showInput: false,
      }),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
