import { createElement } from 'liquidjs';
import { useState, useCallback } from 'liquidjs/hooks';
import { createRoot } from 'liquidjs/dom';
import { FormFieldWrapper } from '../../../../components/form/wrapper/src/index.ts';

function App() {
  const [label, setLabel] = useState('Field Label');
  const [helpText, setHelpText] = useState('This is helpful text');
  const [error, setError] = useState('');
  const [required, setRequired] = useState(false);
  const [disabled, setDisabled] = useState(false);

  return createElement(
    'div',
    { className: 'app' },
    createElement('h1', null, 'FormFieldWrapper'),
    createElement('p', { className: 'subtitle' }, 'Base container for all form field components'),

    createElement(
      'div',
      { className: 'demo-section' },
      createElement('h2', null, 'Live Preview'),
      createElement(
        FormFieldWrapper,
        { label, helpText, error: error || undefined, required, disabled },
        createElement('input', {
          type: 'text',
          placeholder: 'Sample input inside wrapper',
          disabled,
          style: {
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box',
          },
        }),
      ),

      createElement(
        'div',
        { className: 'controls' },
        createElement(
          'label',
          null,
          createElement('input', {
            type: 'checkbox',
            checked: required,
            onChange: () => setRequired((r: boolean) => !r),
          }),
          'Required',
        ),
        createElement(
          'label',
          null,
          createElement('input', {
            type: 'checkbox',
            checked: disabled,
            onChange: () => setDisabled((d: boolean) => !d),
          }),
          'Disabled',
        ),
        createElement(
          'label',
          null,
          createElement('input', {
            type: 'checkbox',
            checked: !!error,
            onChange: () => setError((e: string) => (e ? '' : 'This field has an error')),
          }),
          'Show Error',
        ),
      ),
    ),

    createElement(
      'div',
      { className: 'demo-section' },
      createElement('h2', null, 'With Error State'),
      createElement(
        FormFieldWrapper,
        { label: 'Email', error: 'Invalid email address', required: true },
        createElement('input', {
          type: 'email',
          value: 'bad-email',
          style: {
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #ef4444',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box',
          },
        }),
      ),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
