import { createElement } from 'specifyjs';
import { useState, useCallback } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { DatePicker } from '../../../../components/form/datepicker/src/index.ts';

function App() {
  const [value, setValue] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [showError, setShowError] = useState(false);

  return createElement(
    'div',
    { className: 'app' },
    createElement('h1', null, 'DatePicker'),
    createElement('p', { className: 'subtitle' }, 'Calendar dropdown with month navigation and date constraints'),

    createElement(
      'div',
      { className: 'demo-section' },
      createElement('h2', null, 'Live Preview'),
      createElement(DatePicker, {
        value,
        onChange: setValue,
        label: 'Birthday',
        placeholder: 'Select your birthday...',
        error: showError ? 'Date is required' : undefined,
        disabled,
      }),
      createElement('div', { className: 'output' }, `Selected: ${value || 'none'}`),

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
      createElement('h2', null, 'With Min/Max Constraints'),
      createElement(DatePicker, {
        value: null,
        onChange: () => {},
        label: 'Appointment Date',
        minDate: new Date().toISOString().split('T')[0],
        maxDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        placeholder: 'Next 30 days only...',
      }),
    ),

    createElement(
      'div',
      { className: 'demo-section' },
      createElement('h2', null, 'Pre-selected Date'),
      createElement(DatePicker, {
        value: '2024-12-25',
        onChange: () => {},
        label: 'Holiday',
        format: 'DD/MM/YYYY',
      }),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
