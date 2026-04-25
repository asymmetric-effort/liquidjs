import { createElement } from 'specifyjs';
import { useState } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { Alert } from '../../../../components/feedback/alert/src/index';

function Demo() {
  const [closedAlerts, setClosedAlerts] = useState<string[]>([]);

  const handleClose = (id: string) => {
    setClosedAlerts((prev: string[]) => [...prev, id]);
  };

  const resetAll = () => setClosedAlerts([]);

  return createElement(
    'div',
    { className: 'app' },
    createElement('h1', null, 'Alert Demo'),
    createElement('button', { onClick: resetAll, style: { marginBottom: '16px', padding: '8px 16px', borderRadius: '6px', border: '1px solid #d1d5db', cursor: 'pointer' } }, 'Reset All'),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Alert Types (Subtle)'),
      createElement(Alert, { type: 'info', title: 'Information', message: 'This is an informational alert.', closable: true, onClose: () => handleClose('info-subtle') }),
      createElement('div', { style: { height: '12px' } }),
      createElement(Alert, { type: 'success', title: 'Success', message: 'Operation completed successfully.' }),
      createElement('div', { style: { height: '12px' } }),
      createElement(Alert, { type: 'warning', title: 'Warning', message: 'Please review before continuing.' }),
      createElement('div', { style: { height: '12px' } }),
      createElement(Alert, { type: 'error', title: 'Error', message: 'Something went wrong. Please try again.' }),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Filled Variant'),
      createElement(Alert, { type: 'info', variant: 'filled', message: 'Filled info alert' }),
      createElement('div', { style: { height: '12px' } }),
      createElement(Alert, { type: 'success', variant: 'filled', message: 'Filled success alert' }),
      createElement('div', { style: { height: '12px' } }),
      createElement(Alert, { type: 'warning', variant: 'filled', message: 'Filled warning alert' }),
      createElement('div', { style: { height: '12px' } }),
      createElement(Alert, { type: 'error', variant: 'filled', message: 'Filled error alert' }),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Outline Variant'),
      createElement(Alert, { type: 'info', variant: 'outline', message: 'Outline info alert' }),
      createElement('div', { style: { height: '12px' } }),
      createElement(Alert, { type: 'error', variant: 'outline', title: 'Connection Lost', message: 'Unable to reach the server.', closable: true }),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'With Action'),
      createElement(Alert, {
        type: 'warning',
        title: 'Update Available',
        message: 'A new version is available.',
        action: { label: 'Update Now', onClick: () => alert('Update clicked!') },
        closable: true,
      }),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(Demo, null));
