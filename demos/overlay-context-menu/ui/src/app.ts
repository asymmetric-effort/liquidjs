import { createElement } from 'liquidjs';
import { useState, useCallback } from 'liquidjs/hooks';
import { createRoot } from 'liquidjs/dom';
import { ContextMenu } from '../../../../components/overlay/context-menu/src/index';
import type { ContextMenuItem } from '../../../../components/overlay/context-menu/src/index';

function ContextMenuDemo() {
  const [lastAction, setLastAction] = useState('(none)');

  const basicItems: ContextMenuItem[] = [
    { label: 'Cut', icon: 'X', onClick: () => setLastAction('Cut') },
    { label: 'Copy', icon: 'C', onClick: () => setLastAction('Copy') },
    { label: 'Paste', icon: 'V', onClick: () => setLastAction('Paste') },
    { divider: true },
    { label: 'Select All', onClick: () => setLastAction('Select All') },
  ];

  const nestedItems: ContextMenuItem[] = [
    { label: 'New File', icon: '+', onClick: () => setLastAction('New File') },
    { label: 'New Folder', icon: '+', onClick: () => setLastAction('New Folder') },
    { divider: true },
    {
      label: 'Share',
      icon: '>',
      children: [
        { label: 'Email', onClick: () => setLastAction('Share > Email') },
        { label: 'Slack', onClick: () => setLastAction('Share > Slack') },
        {
          label: 'More',
          children: [
            { label: 'Twitter', onClick: () => setLastAction('Share > More > Twitter') },
            { label: 'LinkedIn', onClick: () => setLastAction('Share > More > LinkedIn') },
          ],
        },
      ],
    },
    { divider: true },
    { label: 'Delete', icon: 'D', onClick: () => setLastAction('Delete') },
    { label: 'Disabled Action', disabled: true, onClick: () => setLastAction('Should not fire') },
  ];

  return createElement(
    'div',
    { className: 'demo' },

    createElement('h1', null, 'Context Menu Component Demo'),
    createElement('p', { className: 'subtitle' }, `Last action: ${lastAction}`),

    // Basic context menu
    createElement(
      'section',
      { className: 'demo-section' },
      createElement('h2', null, 'Basic Context Menu'),
      createElement(
        ContextMenu,
        { items: basicItems },
        createElement(
          'div',
          { className: 'trigger-area' },
          createElement('p', null, 'Right-click anywhere in this area'),
          createElement('p', { className: 'hint' }, 'Try Cut, Copy, Paste, or Select All'),
        ),
      ),
    ),

    // Nested submenus
    createElement(
      'section',
      { className: 'demo-section' },
      createElement('h2', null, 'Nested Submenus'),
      createElement(
        ContextMenu,
        { items: nestedItems },
        createElement(
          'div',
          { className: 'trigger-area trigger-area-alt' },
          createElement('p', null, 'Right-click for nested menu'),
          createElement('p', { className: 'hint' }, 'Includes submenus, dividers, and disabled items'),
        ),
      ),
    ),

    // Keyboard navigation info
    createElement(
      'section',
      { className: 'demo-section' },
      createElement('h2', null, 'Keyboard Navigation'),
      createElement(
        'ul',
        { className: 'feature-list' },
        createElement('li', null, 'Arrow Up/Down: Navigate items'),
        createElement('li', null, 'Arrow Right: Open submenu'),
        createElement('li', null, 'Arrow Left: Close submenu'),
        createElement('li', null, 'Enter: Select item'),
        createElement('li', null, 'Escape: Close menu'),
      ),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(ContextMenuDemo, null));
