import { createElement } from 'liquidjs';
import { useState, useCallback } from 'liquidjs/hooks';
import { createRoot } from 'liquidjs/dom';
import { Dropdown } from '../../../../components/nav/dropdown/src/index';
import type { DropdownItem } from '../../../../components/nav/dropdown/src/index';

function App() {
  const [lastAction, setLastAction] = useState('None');

  const fileItems: DropdownItem[] = [
    { id: 'new', label: 'New File', icon: '+', onClick: () => setLastAction('New File') },
    { id: 'open', label: 'Open...', icon: 'O', onClick: () => setLastAction('Open') },
    { id: 'div1', label: '', divider: true },
    { id: 'save', label: 'Save', icon: 'S', onClick: () => setLastAction('Save') },
    { id: 'save-as', label: 'Save As...', onClick: () => setLastAction('Save As') },
    { id: 'div2', label: '', divider: true },
    { id: 'export', label: 'Export', children: [
      { id: 'pdf', label: 'As PDF', onClick: () => setLastAction('Export PDF') },
      { id: 'csv', label: 'As CSV', onClick: () => setLastAction('Export CSV') },
    ]},
    { id: 'disabled', label: 'Print (unavailable)', disabled: true },
  ];

  const editItems: DropdownItem[] = [
    { id: 'undo', label: 'Undo', onClick: () => setLastAction('Undo') },
    { id: 'redo', label: 'Redo', onClick: () => setLastAction('Redo') },
    { id: 'div', label: '', divider: true },
    { id: 'cut', label: 'Cut', onClick: () => setLastAction('Cut') },
    { id: 'copy', label: 'Copy', onClick: () => setLastAction('Copy') },
    { id: 'paste', label: 'Paste', onClick: () => setLastAction('Paste') },
  ];

  return createElement(
    'div',
    { style: { padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' } },
    createElement('h1', null, 'Dropdown Demo'),
    createElement(
      'div',
      { style: { display: 'flex', gap: '12px', marginBottom: '24px' } },
      createElement(Dropdown, { label: 'File', items: fileItems, width: '200px' }),
      createElement(Dropdown, { label: 'Edit', items: editItems, width: '180px' }),
    ),
    createElement(
      'div',
      { style: { padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px' } },
      createElement('strong', null, 'Last action: '),
      createElement('span', null, lastAction),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
