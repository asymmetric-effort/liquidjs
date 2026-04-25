import { createElement } from 'specifyjs';
import { useState } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { Panel } from '../../../../components/layout/panel/src/index';

function PanelDemo() {
  const [collapsible, setCollapsible] = useState(true);
  const [bordered, setBordered] = useState(true);
  const [shadow, setShadow] = useState<'none' | 'sm' | 'md'>('none');
  const [showIcon, setShowIcon] = useState(true);
  const [showHeaderRight, setShowHeaderRight] = useState(true);

  const iconEl = createElement('span', { style: { fontSize: '16px' } }, '\u2699\ufe0f');
  const headerRightEl = createElement('button', {
    style: { padding: '2px 8px', borderRadius: '4px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontSize: '12px' },
  }, 'Options');

  return createElement('div', { className: 'demo-app' },
    createElement('h1', null, 'Panel Component Demo'),

    createElement('div', { className: 'controls' },
      createElement('label', null,
        createElement('input', { type: 'checkbox', checked: collapsible, onChange: () => setCollapsible((v: boolean) => !v) }),
        ' Collapsible',
      ),
      createElement('label', null,
        createElement('input', { type: 'checkbox', checked: bordered, onChange: () => setBordered((v: boolean) => !v) }),
        ' Bordered',
      ),
      createElement('label', null,
        createElement('input', { type: 'checkbox', checked: showIcon, onChange: () => setShowIcon((v: boolean) => !v) }),
        ' Show Icon',
      ),
      createElement('label', null,
        createElement('input', { type: 'checkbox', checked: showHeaderRight, onChange: () => setShowHeaderRight((v: boolean) => !v) }),
        ' Show Header Right',
      ),
      createElement('label', null, 'Shadow: ',
        createElement('select', {
          value: shadow,
          onChange: (e: Event) => setShadow((e.target as HTMLSelectElement).value as any),
        },
          createElement('option', { value: 'none' }, 'none'),
          createElement('option', { value: 'sm' }, 'sm'),
          createElement('option', { value: 'md' }, 'md'),
        ),
      ),
    ),

    createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' } },
      createElement(Panel, {
        title: 'Configuration',
        collapsible,
        bordered,
        shadow,
        icon: showIcon ? iconEl : undefined,
        headerRight: showHeaderRight ? headerRightEl : undefined,
      },
        createElement('p', null, 'This panel contains configuration options. Try clicking the header to collapse it.'),
        createElement('p', { style: { marginTop: '8px', color: '#6b7280' } }, 'Panels support animated collapse transitions with max-height.'),
      ),

      createElement(Panel, {
        title: 'Details',
        collapsible,
        defaultCollapsed: true,
        bordered,
        shadow,
        icon: showIcon ? createElement('span', { style: { fontSize: '16px' } }, '\ud83d\udcdd') : undefined,
      },
        createElement('p', null, 'This panel starts collapsed by default. Expand it to see the content.'),
        createElement('ul', { style: { marginTop: '8px', paddingLeft: '20px' } },
          createElement('li', null, 'Supports title, icon, and header-right slots'),
          createElement('li', null, 'Configurable border and shadow'),
          createElement('li', null, 'Animated collapse with max-height transition'),
        ),
      ),

      createElement(Panel, {
        title: 'Static Panel (not collapsible)',
        collapsible: false,
        bordered,
        shadow,
      },
        createElement('p', null, 'This panel cannot be collapsed. It always shows its content.'),
      ),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(PanelDemo, null));
