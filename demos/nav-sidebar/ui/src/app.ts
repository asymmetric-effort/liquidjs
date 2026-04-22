import { createElement } from 'liquidjs';
import { useState, useCallback } from 'liquidjs/hooks';
import { createRoot } from 'liquidjs/dom';
import { Sidebar } from '../../../../components/nav/sidebar/src/index';
import type { SidebarItem } from '../../../../components/nav/sidebar/src/index';

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedId, setSelectedId] = useState('dashboard');

  const items: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'D' },
    { id: 'inbox', label: 'Inbox', icon: 'I', badge: '12' },
    {
      id: 'projects',
      label: 'Projects',
      icon: 'P',
      children: [
        { id: 'proj-alpha', label: 'Alpha' },
        { id: 'proj-beta', label: 'Beta' },
        { id: 'proj-gamma', label: 'Gamma', badge: '2' },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'S',
      children: [
        { id: 'general', label: 'General' },
        { id: 'security', label: 'Security' },
        { id: 'notifications', label: 'Notifications' },
      ],
    },
    { id: 'help', label: 'Help', icon: '?' },
  ];

  const handleToggleCollapse = useCallback(() => {
    setCollapsed((prev: boolean) => !prev);
  }, []);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  return createElement(
    'div',
    { style: { display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' } },
    createElement(Sidebar, {
      items,
      collapsed,
      onToggleCollapse: handleToggleCollapse,
      selectedId,
      onSelect: handleSelect,
    }),
    createElement(
      'div',
      { style: { flex: '1', padding: '40px' } },
      createElement('h1', null, 'Sidebar Demo'),
      createElement(
        'div',
        { style: { padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px', marginTop: '16px' } },
        createElement('strong', null, 'Selected: '),
        createElement('span', null, selectedId),
      ),
      createElement(
        'div',
        { style: { padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px', marginTop: '12px' } },
        createElement('strong', null, 'Collapsed: '),
        createElement('span', null, String(collapsed)),
      ),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
