import { createElement } from 'liquidjs';
import { useState, useCallback } from 'liquidjs/hooks';
import { createRoot } from 'liquidjs/dom';
import { Checkbox } from '../../../../components/form/checkbox/src/index.ts';

function App() {
  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showError, setShowError] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');

  return createElement(
    'div',
    { className: 'app' },
    createElement('h1', null, 'Checkbox'),
    createElement('p', { className: 'subtitle' }, 'Custom styled checkbox with label and indeterminate state'),

    createElement(
      'div',
      { className: 'demo-section' },
      createElement('h2', null, 'Live Preview'),
      createElement(Checkbox, {
        checked,
        onChange: setChecked,
        label: 'I agree to the terms and conditions',
        disabled,
        error: showError ? 'You must accept the terms' : undefined,
        indeterminate,
        size,
      }),
      createElement('div', { className: 'output' }, `checked: ${checked}`),

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
          createElement('input', { type: 'checkbox', checked: indeterminate, onChange: () => setIndeterminate((i: boolean) => !i) }),
          'Indeterminate',
        ),
      ),
    ),

    createElement(
      'div',
      { className: 'demo-section' },
      createElement('h2', null, 'Sizes'),
      createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
        createElement(Checkbox, { checked: true, onChange: () => {}, label: 'Small', size: 'sm' }),
        createElement(Checkbox, { checked: true, onChange: () => {}, label: 'Medium (default)', size: 'md' }),
        createElement(Checkbox, { checked: true, onChange: () => {}, label: 'Large', size: 'lg' }),
      ),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
