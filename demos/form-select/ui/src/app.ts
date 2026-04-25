import { createElement } from 'specifyjs';
import { useState, useCallback } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { Select } from '../../../../components/form/select/src/index.ts';

const FRUITS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'mango', label: 'Mango' },
  { value: 'orange', label: 'Orange' },
];

function App() {
  const [value, setValue] = useState('');
  const [multiValue, setMultiValue] = useState<string[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [showError, setShowError] = useState(false);

  return createElement(
    'div',
    { className: 'app' },
    createElement('h1', null, 'Select'),
    createElement('p', { className: 'subtitle' }, 'Dropdown select with search, multi-select, and clearable'),

    createElement(
      'div',
      { className: 'demo-section' },
      createElement('h2', null, 'Single Select'),
      createElement(Select, {
        options: FRUITS,
        value,
        onChange: (v: string | string[]) => setValue(v as string),
        label: 'Favorite Fruit',
        placeholder: 'Choose a fruit...',
        helpText: 'Pick your favorite',
        error: showError ? 'Selection required' : undefined,
        disabled,
        searchable: true,
        clearable: true,
      }),
      createElement('div', { className: 'output' }, `Selected: "${value}"`),

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
      createElement('h2', null, 'Multi Select'),
      createElement(Select, {
        options: FRUITS,
        value: multiValue,
        onChange: (v: string | string[]) => setMultiValue(v as string[]),
        label: 'Fruits',
        placeholder: 'Select multiple...',
        multiple: true,
        searchable: true,
      }),
      createElement('div', { className: 'output' }, `Selected: [${multiValue.join(', ')}]`),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
