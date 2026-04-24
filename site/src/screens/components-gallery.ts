import { createElement } from 'liquidjs';
import { useState, useCallback } from 'liquidjs/hooks';

export function ComponentsGallery() {
  return createElement('div', null,
    createElement('div', { className: 'section' },
      createElement('h2', null, 'Component Gallery'),
      createElement('p', { style: { color: '#64748b', marginBottom: '24px' } },
        'Live previews of LiquidJS components — all rendered by the framework in real time.',
      ),
      createElement('div', { className: 'preview-grid' },
        createElement('div', { className: 'preview-card' },
          createElement('div', { className: 'preview-header' }, 'Toggle'),
          createElement('div', { className: 'preview-body' }, createElement(ToggleDemo, null)),
        ),
        createElement('div', { className: 'preview-card' },
          createElement('div', { className: 'preview-header' }, 'Counter'),
          createElement('div', { className: 'preview-body' }, createElement(CounterDemo, null)),
        ),
        createElement('div', { className: 'preview-card' },
          createElement('div', { className: 'preview-header' }, 'Text Input'),
          createElement('div', { className: 'preview-body' }, createElement(TextInputDemo, null)),
        ),
        createElement('div', { className: 'preview-card' },
          createElement('div', { className: 'preview-header' }, 'List with Filter'),
          createElement('div', { className: 'preview-body' }, createElement(FilterListDemo, null)),
        ),
        createElement('div', { className: 'preview-card' },
          createElement('div', { className: 'preview-header' }, 'Tabs'),
          createElement('div', { className: 'preview-body' }, createElement(TabsDemo, null)),
        ),
        createElement('div', { className: 'preview-card' },
          createElement('div', { className: 'preview-header' }, 'Alert'),
          createElement('div', { className: 'preview-body' }, createElement(AlertDemo, null)),
        ),
      ),
    ),
  );
}

function ToggleDemo() {
  const [on, setOn] = useState(false);
  return createElement('div', { className: 'demo-toggle', onClick: () => setOn(!on) },
    createElement('div', { className: `demo-toggle-track ${on ? 'on' : ''}` },
      createElement('div', { className: 'demo-toggle-thumb' }),
    ),
    createElement('span', { style: { fontSize: '14px' } }, on ? 'On' : 'Off'),
  );
}

function CounterDemo() {
  const [count, setCount] = useState(0);
  const btnStyle = {
    padding: '6px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    backgroundColor: '#f8fafc',
  };
  return createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } },
    createElement('button', { style: btnStyle, onClick: () => setCount(c => c - 1) }, '-'),
    createElement('span', { style: { fontSize: '24px', fontWeight: '700', minWidth: '40px', textAlign: 'center' } }, String(count)),
    createElement('button', { style: btnStyle, onClick: () => setCount(c => c + 1) }, '+'),
  );
}

function TextInputDemo() {
  const [value, setValue] = useState('');
  const inputStyle = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    width: '100%',
    outline: 'none',
  };
  return createElement('div', null,
    createElement('input', {
      type: 'text',
      placeholder: 'Type something...',
      value,
      onInput: (e: Event) => setValue((e.target as HTMLInputElement).value),
      style: inputStyle,
    }),
    value
      ? createElement('p', { style: { fontSize: '13px', color: '#64748b', marginTop: '8px' } },
          `You typed: "${value}" (${value.length} chars)`,
        )
      : null,
  );
}

function FilterListDemo() {
  const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'];
  const [filter, setFilter] = useState('');
  const filtered = items.filter(i => i.toLowerCase().includes(filter.toLowerCase()));

  return createElement('div', null,
    createElement('input', {
      type: 'text',
      placeholder: 'Filter fruits...',
      value: filter,
      onInput: (e: Event) => setFilter((e.target as HTMLInputElement).value),
      style: { padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px', width: '100%', marginBottom: '8px' },
    }),
    createElement('ul', { style: { listStyle: 'none', fontSize: '14px' } },
      ...filtered.map(item =>
        createElement('li', { key: item, style: { padding: '4px 0', borderBottom: '1px solid #f1f5f9' } }, item),
      ),
    ),
    filtered.length === 0
      ? createElement('p', { style: { fontSize: '13px', color: '#94a3b8' } }, 'No matches')
      : null,
  );
}

function TabsDemo() {
  const tabs = ['Overview', 'Details', 'Settings'];
  const [active, setActive] = useState(0);
  const tabStyle = (isActive: boolean) => ({
    padding: '6px 14px',
    border: 'none',
    borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent',
    background: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: isActive ? '600' : '400',
    color: isActive ? '#3b82f6' : '#64748b',
  });

  return createElement('div', null,
    createElement('div', { style: { display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '12px' } },
      ...tabs.map((tab, i) =>
        createElement('button', { key: tab, style: tabStyle(i === active), onClick: () => setActive(i) }, tab),
      ),
    ),
    createElement('div', { style: { fontSize: '14px', color: '#64748b' } },
      `Content for ${tabs[active]} tab.`,
    ),
  );
}

function AlertDemo() {
  const [visible, setVisible] = useState(true);
  if (!visible) {
    return createElement('button', {
      onClick: () => setVisible(true),
      style: { padding: '6px 14px', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
    }, 'Show Alert');
  }
  return createElement('div', {
    style: {
      padding: '12px 16px',
      background: '#eff6ff',
      border: '1px solid #bfdbfe',
      borderRadius: '6px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '14px',
      color: '#1e40af',
    },
  },
    createElement('span', null, 'This is an informational alert built with LiquidJS.'),
    createElement('button', {
      onClick: () => setVisible(false),
      style: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#1e40af' },
    }, '\u00d7'),
  );
}
