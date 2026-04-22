import { createElement } from 'liquidjs';
import { useState, useCallback } from 'liquidjs/hooks';
import { createRoot } from 'liquidjs/dom';
import { TextField } from '../../../../components/form/textfield/src/index.ts';

function App() {
  const [value, setValue] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [showError, setShowError] = useState(false);
  const [lastEvent, setLastEvent] = useState('');

  const handleChange = useCallback((v: string) => {
    setValue(v);
    setLastEvent(`onChange: "${v}"`);
  }, []);

  return createElement(
    'div',
    { className: 'app' },
    createElement('h1', null, 'TextField'),
    createElement('p', { className: 'subtitle' }, 'Single-line text input with label, help text, and validation'),

    createElement(
      'div',
      { className: 'demo-section' },
      createElement('h2', null, 'Live Preview'),
      createElement(TextField, {
        label: 'Username',
        value,
        onChange: handleChange,
        placeholder: 'Enter username...',
        helpText: 'Choose a unique username',
        error: showError ? 'Username is required' : undefined,
        disabled,
        required: true,
      }),
      lastEvent ? createElement('div', { className: 'output' }, lastEvent) : null,

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
      createElement('h2', null, 'Password Field'),
      createElement(TextField, { label: 'Password', type: 'password', placeholder: 'Enter password...' }),
    ),

    createElement(
      'div',
      { className: 'demo-section' },
      createElement('h2', null, 'With Prefix & Suffix'),
      createElement(TextField, {
        label: 'Website',
        placeholder: 'example.com',
        prefix: createElement('span', null, 'https://'),
        suffix: createElement('span', null, '.com'),
      }),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
