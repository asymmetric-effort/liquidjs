import { createElement } from 'specifyjs';
import { useState, useCallback } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { TimePicker } from '../../../../components/form/timepicker/src/index.ts';

function App() {
  const [value, setValue] = useState('09:00');
  const [disabled, setDisabled] = useState(false);
  const [showError, setShowError] = useState(false);
  const [format, setFormat] = useState<'24h' | '12h'>('24h');

  return createElement(
    'div',
    { className: 'app' },
    createElement('h1', null, 'TimePicker'),
    createElement('p', { className: 'subtitle' }, 'Time selection with hour/minute spinners and AM/PM'),

    createElement(
      'div',
      { className: 'demo-section' },
      createElement('h2', null, 'Live Preview'),
      createElement(TimePicker, {
        value,
        onChange: setValue,
        label: 'Meeting Time',
        error: showError ? 'Invalid time' : undefined,
        disabled,
        format,
      }),
      createElement('div', { className: 'output' }, `Value: "${value}"`),

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
          createElement('input', {
            type: 'checkbox',
            checked: format === '12h',
            onChange: () => setFormat((f: string) => (f === '24h' ? '12h' : '24h') as any),
          }),
          '12-Hour Format',
        ),
      ),
    ),

    createElement(
      'div',
      { className: 'demo-section' },
      createElement('h2', null, '15-Minute Steps'),
      createElement(TimePicker, {
        value: '14:30',
        onChange: () => {},
        label: 'Appointment',
        minuteStep: 15,
      }),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
