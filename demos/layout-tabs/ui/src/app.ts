import { createElement } from 'specifyjs';
import { useState } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { Tabs } from '../../../../components/layout/tabs/src/index';

function TabsDemo() {
  const [position, setPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top');
  const [variant, setVariant] = useState<'line' | 'card' | 'pill'>('line');
  const [disableSecond, setDisableSecond] = useState(false);
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: createElement('span', null, '\ud83d\udcca'),
      content: createElement('div', null,
        createElement('h3', null, 'Overview'),
        createElement('p', null, 'This is the overview tab. It provides a high-level summary of the application state.'),
        createElement('p', { style: { marginTop: '8px', color: '#6b7280' } }, 'Tabs support keyboard navigation with arrow keys, Home, and End.'),
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: createElement('span', null, '\u2699\ufe0f'),
      disabled: disableSecond,
      content: createElement('div', null,
        createElement('h3', null, 'Settings'),
        createElement('p', null, 'Configure your preferences here.'),
        createElement('ul', { style: { marginTop: '8px', paddingLeft: '20px' } },
          createElement('li', null, 'Theme: Light/Dark'),
          createElement('li', null, 'Language: English'),
          createElement('li', null, 'Notifications: On'),
        ),
      ),
    },
    {
      id: 'activity',
      label: 'Activity',
      icon: createElement('span', null, '\ud83d\udcc5'),
      content: createElement('div', null,
        createElement('h3', null, 'Recent Activity'),
        createElement('p', null, 'View your recent actions and history.'),
      ),
    },
    {
      id: 'help',
      label: 'Help',
      content: createElement('div', null,
        createElement('h3', null, 'Help & Support'),
        createElement('p', null, 'Get help with common issues or contact support.'),
      ),
    },
  ];

  return createElement('div', { className: 'demo-app' },
    createElement('h1', null, 'Tabs Component Demo'),

    createElement('div', { className: 'controls' },
      createElement('label', null, 'Position: ',
        createElement('select', {
          value: position,
          onChange: (e: Event) => setPosition((e.target as HTMLSelectElement).value as any),
        },
          createElement('option', { value: 'top' }, 'top'),
          createElement('option', { value: 'bottom' }, 'bottom'),
          createElement('option', { value: 'left' }, 'left'),
          createElement('option', { value: 'right' }, 'right'),
        ),
      ),
      createElement('label', null, 'Variant: ',
        createElement('select', {
          value: variant,
          onChange: (e: Event) => setVariant((e.target as HTMLSelectElement).value as any),
        },
          createElement('option', { value: 'line' }, 'line'),
          createElement('option', { value: 'card' }, 'card'),
          createElement('option', { value: 'pill' }, 'pill'),
        ),
      ),
      createElement('label', null,
        createElement('input', { type: 'checkbox', checked: disableSecond, onChange: () => setDisableSecond((v: boolean) => !v) }),
        ' Disable Settings Tab',
      ),
      createElement('label', null, 'Active Tab: ',
        createElement('select', {
          value: activeTab ?? '',
          onChange: (e: Event) => {
            const v = (e.target as HTMLSelectElement).value;
            setActiveTab(v || undefined);
          },
        },
          createElement('option', { value: '' }, '(uncontrolled)'),
          createElement('option', { value: 'overview' }, 'Overview'),
          createElement('option', { value: 'settings' }, 'Settings'),
          createElement('option', { value: 'activity' }, 'Activity'),
          createElement('option', { value: 'help' }, 'Help'),
        ),
      ),
    ),

    createElement('div', { style: { marginTop: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', minHeight: '300px' } },
      createElement(Tabs, {
        tabs,
        position,
        variant,
        activeTab,
        onChange: (id: string) => setActiveTab(id),
      }),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(TabsDemo, null));
