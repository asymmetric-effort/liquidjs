import { createElement } from 'liquidjs';
import { useState, useCallback } from 'liquidjs/hooks';
import { createRoot } from 'liquidjs/dom';
import { Breadcrumb } from '../../../../components/nav/breadcrumb/src/index';
import type { BreadcrumbItem, BreadcrumbSize } from '../../../../components/nav/breadcrumb/src/index';

function App() {
  const [currentPath, setCurrentPath] = useState<string[]>(['Home', 'Products', 'Electronics', 'Phones', 'Smartphones']);
  const [size, setSize] = useState<BreadcrumbSize>('md');

  const items: BreadcrumbItem[] = currentPath.map((label, i) => ({
    label,
    href: i < currentPath.length - 1 ? `#${label.toLowerCase()}` : undefined,
    onClick: i < currentPath.length - 1
      ? () => setCurrentPath(currentPath.slice(0, i + 1).concat('Current'))
      : undefined,
  }));

  const longItems: BreadcrumbItem[] = [
    { label: 'Root', href: '#' },
    { label: 'Level 1', href: '#' },
    { label: 'Level 2', href: '#' },
    { label: 'Level 3', href: '#' },
    { label: 'Level 4', href: '#' },
    { label: 'Level 5', href: '#' },
    { label: 'Current Page' },
  ];

  const resetPath = useCallback(() => {
    setCurrentPath(['Home', 'Products', 'Electronics', 'Phones', 'Smartphones']);
  }, []);

  return createElement(
    'div',
    { style: { padding: '40px', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' } },
    createElement('h1', null, 'Breadcrumb Demo'),

    createElement('h3', { style: { marginTop: '24px', marginBottom: '8px' } }, 'Interactive Breadcrumb'),
    createElement(Breadcrumb, { items, size }),
    createElement(
      'button',
      { onClick: resetPath, style: { marginTop: '12px', padding: '6px 12px', borderRadius: '4px', border: '1px solid #d1d5db', cursor: 'pointer' } },
      'Reset Path',
    ),

    createElement('h3', { style: { marginTop: '32px', marginBottom: '8px' } }, 'Collapsible (maxItems=3)'),
    createElement(Breadcrumb, { items: longItems, maxItems: 3 }),

    createElement('h3', { style: { marginTop: '32px', marginBottom: '8px' } }, 'Custom Separator'),
    createElement(Breadcrumb, { items: items.slice(0, 3), separator: '>' }),

    createElement('h3', { style: { marginTop: '32px', marginBottom: '8px' } }, 'Size Variants'),
    createElement(
      'div',
      { style: { display: 'flex', gap: '8px', marginBottom: '12px' } },
      ...(['sm', 'md', 'lg'] as BreadcrumbSize[]).map((s) =>
        createElement('button', {
          key: s,
          onClick: () => setSize(s),
          style: {
            padding: '4px 12px',
            borderRadius: '4px',
            border: size === s ? '2px solid #2563eb' : '1px solid #d1d5db',
            cursor: 'pointer',
            backgroundColor: size === s ? '#eff6ff' : '#fff',
          },
        }, s.toUpperCase()),
      ),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
