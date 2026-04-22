import { createElement } from 'liquidjs';
import { useState } from 'liquidjs/hooks';
import { createRoot } from 'liquidjs/dom';
import { Card } from '../../../../components/layout/card/src/index';

function CardDemo() {
  const [hoverable, setHoverable] = useState(true);
  const [bordered, setBordered] = useState(true);
  const [shadow, setShadow] = useState<'none' | 'sm' | 'md' | 'lg'>('sm');
  const [showImage, setShowImage] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [padding, setPadding] = useState('16px');
  const [borderRadius, setBorderRadius] = useState('8px');

  return createElement('div', { className: 'demo-app' },
    createElement('h1', null, 'Card Component Demo'),

    createElement('div', { className: 'controls' },
      createElement('label', null,
        createElement('input', { type: 'checkbox', checked: hoverable, onChange: () => setHoverable((v: boolean) => !v) }),
        ' Hoverable',
      ),
      createElement('label', null,
        createElement('input', { type: 'checkbox', checked: bordered, onChange: () => setBordered((v: boolean) => !v) }),
        ' Bordered',
      ),
      createElement('label', null,
        createElement('input', { type: 'checkbox', checked: showImage, onChange: () => setShowImage((v: boolean) => !v) }),
        ' Show Image',
      ),
      createElement('label', null,
        createElement('input', { type: 'checkbox', checked: showFooter, onChange: () => setShowFooter((v: boolean) => !v) }),
        ' Show Footer',
      ),
      createElement('label', null, 'Shadow: ',
        createElement('select', {
          value: shadow,
          onChange: (e: Event) => setShadow((e.target as HTMLSelectElement).value as any),
        },
          createElement('option', { value: 'none' }, 'none'),
          createElement('option', { value: 'sm' }, 'sm'),
          createElement('option', { value: 'md' }, 'md'),
          createElement('option', { value: 'lg' }, 'lg'),
        ),
      ),
      createElement('label', null, 'Padding: ',
        createElement('input', { type: 'text', value: padding, onInput: (e: Event) => setPadding((e.target as HTMLInputElement).value) }),
      ),
      createElement('label', null, 'Border Radius: ',
        createElement('input', { type: 'text', value: borderRadius, onInput: (e: Event) => setBorderRadius((e.target as HTMLInputElement).value) }),
      ),
    ),

    createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '20px' } },
      createElement(Card, {
        title: 'Getting Started',
        subtitle: 'Learn the basics of LiquidJS',
        hoverable,
        bordered,
        shadow,
        padding,
        borderRadius,
        image: showImage ? 'https://picsum.photos/seed/liquid1/400/200' : undefined,
        imageAlt: 'Getting started illustration',
        headerAction: createElement('button', { style: { padding: '4px 8px', borderRadius: '4px', border: '1px solid #e5e7eb', background: 'none', cursor: 'pointer' } }, 'Edit'),
        footer: showFooter ? createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280' } },
          createElement('span', null, 'Updated 2 hours ago'),
          createElement('span', null, '5 min read'),
        ) : undefined,
      }, createElement('p', null, 'LiquidJS provides a familiar component model with hooks, context, and a virtual DOM reconciler.')),

      createElement(Card, {
        title: 'Advanced Patterns',
        subtitle: 'Deep dive into performance',
        hoverable,
        bordered,
        shadow,
        padding,
        borderRadius,
        image: showImage ? 'https://picsum.photos/seed/liquid2/400/200' : undefined,
        footer: showFooter ? createElement('div', { style: { fontSize: '13px', color: '#6b7280' } }, 'Published yesterday') : undefined,
      }, createElement('p', null, 'Explore memoization, lazy loading, concurrent rendering, and more.')),

      createElement(Card, {
        title: 'Component Library',
        hoverable,
        bordered,
        shadow,
        padding,
        borderRadius,
      }, createElement('p', null, 'A card with no subtitle, no image, and no footer. Minimal configuration.')),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(CardDemo, null));
