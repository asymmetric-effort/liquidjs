import { createElement } from 'liquidjs';
import { useState } from 'liquidjs/hooks';
import { createRoot } from 'liquidjs/dom';
import { ScrollContainer } from '../../../../components/layout/scroll-container/src/index';

function ScrollContainerDemo() {
  const [direction, setDirection] = useState<'vertical' | 'horizontal' | 'both'>('vertical');
  const [maxHeight, setMaxHeight] = useState('400px');
  const [showScrollbar, setShowScrollbar] = useState<'auto' | 'always' | 'hover' | 'never'>('auto');
  const [shadow, setShadow] = useState(true);
  const [padding, setPadding] = useState('16px');
  const [itemCount, setItemCount] = useState(30);

  return createElement('div', { className: 'demo-app' },
    createElement('h1', null, 'ScrollContainer Component Demo'),

    createElement('div', { className: 'controls' },
      createElement('label', null, 'Direction: ',
        createElement('select', {
          value: direction,
          onChange: (e: Event) => setDirection((e.target as HTMLSelectElement).value as any),
        },
          createElement('option', { value: 'vertical' }, 'vertical'),
          createElement('option', { value: 'horizontal' }, 'horizontal'),
          createElement('option', { value: 'both' }, 'both'),
        ),
      ),
      createElement('label', null, 'Max Height: ',
        createElement('input', { type: 'text', value: maxHeight, onInput: (e: Event) => setMaxHeight((e.target as HTMLInputElement).value) }),
      ),
      createElement('label', null, 'Scrollbar: ',
        createElement('select', {
          value: showScrollbar,
          onChange: (e: Event) => setShowScrollbar((e.target as HTMLSelectElement).value as any),
        },
          createElement('option', { value: 'auto' }, 'auto'),
          createElement('option', { value: 'always' }, 'always'),
          createElement('option', { value: 'hover' }, 'hover'),
          createElement('option', { value: 'never' }, 'never'),
        ),
      ),
      createElement('label', null,
        createElement('input', { type: 'checkbox', checked: shadow, onChange: () => setShadow((v: boolean) => !v) }),
        ' Edge Shadows',
      ),
      createElement('label', null, 'Padding: ',
        createElement('input', { type: 'text', value: padding, onInput: (e: Event) => setPadding((e.target as HTMLInputElement).value) }),
      ),
      createElement('label', null, 'Items: ',
        createElement('input', {
          type: 'range', min: '5', max: '100', value: String(itemCount),
          onInput: (e: Event) => setItemCount(Number((e.target as HTMLInputElement).value)),
        }),
        createElement('span', null, ` ${itemCount}`),
      ),
    ),

    createElement('div', { style: { marginTop: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' } },
      createElement(ScrollContainer, {
        direction,
        maxHeight,
        showScrollbar,
        shadow,
        padding,
      },
        direction === 'horizontal' || direction === 'both'
          ? createElement('div', { style: { display: 'flex', gap: '12px', width: `${itemCount * 180}px` } },
              ...Array.from({ length: itemCount }, (_, i) =>
                createElement('div', {
                  key: String(i),
                  style: {
                    flexShrink: '0',
                    width: '160px',
                    padding: '16px',
                    backgroundColor: `hsl(${i * 12}, 60%, 95%)`,
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                  },
                },
                  createElement('strong', null, `Card ${i + 1}`),
                  createElement('p', { style: { fontSize: '13px', color: '#6b7280', marginTop: '4px' } }, 'Scroll horizontally to see more items.'),
                ),
              ),
            )
          : createElement('div', null,
              ...Array.from({ length: itemCount }, (_, i) =>
                createElement('div', {
                  key: String(i),
                  style: {
                    padding: '12px 16px',
                    borderBottom: '1px solid #f3f4f6',
                    backgroundColor: i % 2 === 0 ? '#ffffff' : '#f9fafb',
                  },
                },
                  createElement('strong', null, `Item ${i + 1}`),
                  createElement('p', { style: { fontSize: '13px', color: '#6b7280', marginTop: '2px' } }, `This is row number ${i + 1}. Scroll to see more content below.`),
                ),
              ),
            ),
      ),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(ScrollContainerDemo, null));
