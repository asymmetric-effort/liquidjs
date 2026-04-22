import { createElement } from 'liquidjs';
import { useState, useCallback } from 'liquidjs/hooks';
import { createRoot } from 'liquidjs/dom';
import { Toolbar } from '../../../../components/nav/toolbar/src/index';
import type { ToolbarItem, ToolbarSize, ToolbarVariant } from '../../../../components/nav/toolbar/src/index';

function App() {
  const [lastAction, setLastAction] = useState('None');
  const [boldActive, setBoldActive] = useState(false);
  const [italicActive, setItalicActive] = useState(false);
  const [size, setSize] = useState<ToolbarSize>('md');
  const [variant, setVariant] = useState<ToolbarVariant>('flat');

  const items: ToolbarItem[] = [
    { id: 'bold', label: 'Bold', icon: 'B', type: 'button', active: boldActive, onClick: () => { setBoldActive((p: boolean) => !p); setLastAction('Toggle Bold'); } },
    { id: 'italic', label: 'Italic', icon: 'I', type: 'button', active: italicActive, onClick: () => { setItalicActive((p: boolean) => !p); setLastAction('Toggle Italic'); } },
    { id: 'underline', label: 'Underline', icon: 'U', type: 'button', onClick: () => setLastAction('Underline') },
    { id: 'sep1', type: 'separator' } as ToolbarItem,
    { id: 'align-left', icon: 'L', type: 'button', onClick: () => setLastAction('Align Left') },
    { id: 'align-center', icon: 'C', type: 'button', onClick: () => setLastAction('Align Center') },
    { id: 'align-right', icon: 'R', type: 'button', onClick: () => setLastAction('Align Right') },
    { id: 'spacer1', type: 'spacer' } as ToolbarItem,
    { id: 'undo', label: 'Undo', type: 'button', onClick: () => setLastAction('Undo') },
    { id: 'redo', label: 'Redo', type: 'button', onClick: () => setLastAction('Redo') },
    { id: 'sep2', type: 'separator' } as ToolbarItem,
    { id: 'disabled-btn', label: 'Locked', type: 'button', disabled: true },
  ];

  return createElement(
    'div',
    { style: { padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' } },
    createElement('h1', null, 'Toolbar Demo'),

    createElement(
      'div',
      { style: { display: 'flex', gap: '12px', marginBottom: '20px' } },
      ...(['sm', 'md', 'lg'] as ToolbarSize[]).map((s) =>
        createElement('button', {
          key: s,
          onClick: () => setSize(s),
          style: {
            padding: '4px 12px', borderRadius: '4px', cursor: 'pointer',
            border: size === s ? '2px solid #2563eb' : '1px solid #d1d5db',
            backgroundColor: size === s ? '#eff6ff' : '#fff',
          },
        }, s.toUpperCase()),
      ),
      createElement('button', {
        onClick: () => setVariant(variant === 'flat' ? 'raised' : 'flat'),
        style: { padding: '4px 12px', borderRadius: '4px', border: '1px solid #d1d5db', cursor: 'pointer' },
      }, `Variant: ${variant}`),
    ),

    createElement(
      'div',
      { style: { marginBottom: '20px' } },
      createElement(Toolbar, { items, size, variant }),
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
