import { createElement } from 'specifyjs';
import { useState, useCallback } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { Toggle } from '../../../../components/form/toggle/src/index.ts';

function App() {
  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [labelPos, setLabelPos] = useState<'left' | 'right'>('right');

  return createElement(
    'div',
    { className: 'app' },
    createElement('h1', null, 'Toggle'),
    createElement('p', { className: 'subtitle' }, 'Toggle switch with sliding animation'),

    createElement(
      'div',
      { className: 'demo-section' },
      createElement('h2', null, 'Live Preview'),
      createElement(Toggle, {
        checked,
        onChange: setChecked,
        label: 'Dark Mode',
        disabled,
        labelPosition: labelPos,
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
          createElement('input', {
            type: 'checkbox',
            checked: labelPos === 'left',
            onChange: () => setLabelPos((p: string) => (p === 'left' ? 'right' : 'left') as any),
          }),
          'Label Left',
        ),
      ),
    ),

    createElement(
      'div',
      { className: 'demo-section' },
      createElement('h2', null, 'Sizes'),
      createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
        createElement(Toggle, { checked: true, onChange: () => {}, label: 'Small', size: 'sm' }),
        createElement(Toggle, { checked: true, onChange: () => {}, label: 'Medium', size: 'md' }),
        createElement(Toggle, { checked: true, onChange: () => {}, label: 'Large', size: 'lg' }),
      ),
    ),

    createElement(
      'div',
      { className: 'demo-section' },
      createElement('h2', null, 'Custom Colors'),
      createElement(Toggle, { checked: true, onChange: () => {}, label: 'Success', onColor: '#22c55e' }),
      createElement('div', { style: { height: '8px' } }),
      createElement(Toggle, { checked: true, onChange: () => {}, label: 'Danger', onColor: '#ef4444' }),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
