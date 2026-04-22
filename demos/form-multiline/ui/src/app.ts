import { createElement } from 'liquidjs';
import { useState, useCallback } from 'liquidjs/hooks';
import { createRoot } from 'liquidjs/dom';
import { MultilineField } from '../../../../components/form/multiline/src/index.ts';

function App() {
  const [value, setValue] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showCount, setShowCount] = useState(true);

  return createElement(
    'div',
    { className: 'app' },
    createElement('h1', null, 'MultilineField'),
    createElement('p', { className: 'subtitle' }, 'Multi-line textarea with character count and auto-resize'),

    createElement(
      'div',
      { className: 'demo-section' },
      createElement('h2', null, 'Live Preview'),
      createElement(MultilineField, {
        label: 'Description',
        value,
        onChange: setValue,
        placeholder: 'Enter a description...',
        helpText: 'Max 200 characters',
        error: showError ? 'Description is too short' : undefined,
        disabled,
        rows: 4,
        maxLength: 200,
        showCount,
        required: true,
      }),

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
          createElement('input', { type: 'checkbox', checked: showCount, onChange: () => setShowCount((c: boolean) => !c) }),
          'Show Count',
        ),
      ),
    ),

    createElement(
      'div',
      { className: 'demo-section' },
      createElement('h2', null, 'Auto-Resize'),
      createElement(MultilineField, {
        label: 'Notes',
        placeholder: 'Start typing to see auto-resize...',
        autoResize: true,
        minHeight: '60px',
        maxHeight: '300px',
      }),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
