import { createElement } from 'specifyjs';
import { useState, useCallback } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { TextEditor } from '../../../../components/form/texteditor/src/index.ts';

function App() {
  const [html, setHtml] = useState('<p>Hello <b>world</b>!</p>');
  const [disabled, setDisabled] = useState(false);
  const [showError, setShowError] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  return createElement(
    'div',
    { className: 'app' },
    createElement('h1', null, 'TextEditor'),
    createElement('p', { className: 'subtitle' }, 'WYSIWYG rich text editor with toolbar'),

    createElement(
      'div',
      { className: 'demo-section' },
      createElement('h2', null, 'Live Preview'),
      createElement(TextEditor, {
        label: 'Content',
        value: html,
        onChange: setHtml,
        helpText: 'Use the toolbar to format text',
        error: showError ? 'Content is required' : undefined,
        disabled,
        readOnly,
        minHeight: '200px',
      }),
      createElement('div', { className: 'output' }, `HTML length: ${html.length} chars`),

      createElement(
        'div',
        { className: 'controls' },
        createElement('label', null,
          createElement('input', { type: 'checkbox', checked: disabled, onChange: () => setDisabled((d: boolean) => !d) }),
          'Disabled',
        ),
        createElement('label', null,
          createElement('input', { type: 'checkbox', checked: readOnly, onChange: () => setReadOnly((r: boolean) => !r) }),
          'Read Only',
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
      createElement('h2', null, 'Minimal Toolbar'),
      createElement(TextEditor, {
        label: 'Simple Editor',
        placeholder: 'Type here...',
        toolbar: ['bold', 'italic', 'underline', 'bulletList', 'orderedList'],
        minHeight: '120px',
      }),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
