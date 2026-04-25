import { createElement } from 'specifyjs';
import { useState, useCallback } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { Menubar } from '../../../../components/nav/menubar/src/index';
import type { MenuDefinition } from '../../../../components/nav/menubar/src/index';

function App() {
  const [lastAction, setLastAction] = useState('None');

  const menus: MenuDefinition[] = [
    {
      id: 'file',
      label: 'File',
      items: [
        { id: 'new', label: 'New', shortcut: 'Ctrl+N', onClick: () => setLastAction('File > New') },
        { id: 'open', label: 'Open...', shortcut: 'Ctrl+O', onClick: () => setLastAction('File > Open') },
        { id: 'div1', label: '', divider: true },
        { id: 'save', label: 'Save', shortcut: 'Ctrl+S', onClick: () => setLastAction('File > Save') },
        { id: 'save-as', label: 'Save As...', onClick: () => setLastAction('File > Save As') },
        { id: 'div2', label: '', divider: true },
        { id: 'exit', label: 'Exit', onClick: () => setLastAction('File > Exit') },
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      items: [
        { id: 'undo', label: 'Undo', shortcut: 'Ctrl+Z', onClick: () => setLastAction('Edit > Undo') },
        { id: 'redo', label: 'Redo', shortcut: 'Ctrl+Y', onClick: () => setLastAction('Edit > Redo') },
        { id: 'div', label: '', divider: true },
        { id: 'cut', label: 'Cut', onClick: () => setLastAction('Edit > Cut') },
        { id: 'copy', label: 'Copy', onClick: () => setLastAction('Edit > Copy') },
        { id: 'paste', label: 'Paste', onClick: () => setLastAction('Edit > Paste') },
        { id: 'div2', label: '', divider: true },
        { id: 'disabled', label: 'Find (unavailable)', disabled: true },
      ],
    },
    {
      id: 'view',
      label: 'View',
      items: [
        { id: 'zoom-in', label: 'Zoom In', onClick: () => setLastAction('View > Zoom In') },
        { id: 'zoom-out', label: 'Zoom Out', onClick: () => setLastAction('View > Zoom Out') },
        { id: 'reset', label: 'Reset Zoom', onClick: () => setLastAction('View > Reset Zoom') },
      ],
    },
    {
      id: 'help',
      label: 'Help',
      items: [
        { id: 'docs', label: 'Documentation', onClick: () => setLastAction('Help > Documentation') },
        { id: 'about', label: 'About', onClick: () => setLastAction('Help > About') },
      ],
    },
  ];

  return createElement(
    'div',
    { style: { fontFamily: 'sans-serif', minHeight: '100vh' } },
    createElement(Menubar, { menus }),
    createElement(
      'div',
      { style: { padding: '40px', maxWidth: '600px', margin: '0 auto' } },
      createElement('h1', null, 'Menubar Demo'),
      createElement(
        'p',
        { style: { color: '#6b7280', marginBottom: '24px' } },
        'Click the menu items above to see actions logged below.',
      ),
      createElement(
        'div',
        { style: { padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px' } },
        createElement('strong', null, 'Last action: '),
        createElement('span', null, lastAction),
      ),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
