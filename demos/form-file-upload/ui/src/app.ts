import { createElement } from 'specifyjs';
import { useState, useCallback } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { FileUpload } from '../../../../components/form/file-upload/src/index.ts';

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [disabled, setDisabled] = useState(false);

  return createElement(
    'div',
    { className: 'app' },
    createElement('h1', null, 'FileUpload'),
    createElement('p', { className: 'subtitle' }, 'Drag-and-drop file upload with size validation'),

    createElement(
      'div',
      { className: 'demo-section' },
      createElement('h2', null, 'Single File Upload'),
      createElement(FileUpload, {
        onChange: setFiles,
        label: 'Profile Picture',
        helpText: 'PNG or JPG, max 5MB',
        accept: 'image/*',
        maxSize: 5 * 1024 * 1024,
        disabled,
      }),
      createElement('div', { className: 'output' }, `Files: ${files.length}`),

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
      createElement('h2', null, 'Multiple Files'),
      createElement(FileUpload, {
        onChange: () => {},
        label: 'Attachments',
        helpText: 'Upload multiple documents',
        accept: '.pdf,.doc,.docx,.txt',
        multiple: true,
      }),
    ),

    createElement(
      'div',
      { className: 'demo-section' },
      createElement('h2', null, 'Any File Type'),
      createElement(FileUpload, {
        onChange: () => {},
        label: 'Upload',
        multiple: true,
        maxSize: 10 * 1024 * 1024,
      }),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
