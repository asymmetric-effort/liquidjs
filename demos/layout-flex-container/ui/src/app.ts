import { createElement } from 'liquidjs';
import { useState } from 'liquidjs/hooks';
import { createRoot } from 'liquidjs/dom';
import { FlexContainer, FlexItem } from '../../../../components/layout/flex-container/src/index';

function FlexDemo() {
  const [direction, setDirection] = useState<'row' | 'row-reverse' | 'column' | 'column-reverse'>('row');
  const [wrap, setWrap] = useState<'nowrap' | 'wrap' | 'wrap-reverse'>('wrap');
  const [gap, setGap] = useState('12px');
  const [alignItems, setAlignItems] = useState('center');
  const [justifyContent, setJustifyContent] = useState('flex-start');
  const [itemCount, setItemCount] = useState(6);

  return createElement('div', { className: 'demo-app' },
    createElement('h1', null, 'FlexContainer Component Demo'),

    createElement('div', { className: 'controls' },
      createElement('label', null, 'Direction: ',
        createElement('select', {
          value: direction,
          onChange: (e: Event) => setDirection((e.target as HTMLSelectElement).value as any),
        },
          createElement('option', { value: 'row' }, 'row'),
          createElement('option', { value: 'row-reverse' }, 'row-reverse'),
          createElement('option', { value: 'column' }, 'column'),
          createElement('option', { value: 'column-reverse' }, 'column-reverse'),
        ),
      ),
      createElement('label', null, 'Wrap: ',
        createElement('select', {
          value: wrap,
          onChange: (e: Event) => setWrap((e.target as HTMLSelectElement).value as any),
        },
          createElement('option', { value: 'nowrap' }, 'nowrap'),
          createElement('option', { value: 'wrap' }, 'wrap'),
          createElement('option', { value: 'wrap-reverse' }, 'wrap-reverse'),
        ),
      ),
      createElement('label', null, 'Gap: ',
        createElement('input', {
          type: 'text', value: gap,
          onInput: (e: Event) => setGap((e.target as HTMLInputElement).value),
        }),
      ),
      createElement('label', null, 'Align Items: ',
        createElement('select', {
          value: alignItems,
          onChange: (e: Event) => setAlignItems((e.target as HTMLSelectElement).value),
        },
          createElement('option', { value: 'flex-start' }, 'flex-start'),
          createElement('option', { value: 'center' }, 'center'),
          createElement('option', { value: 'flex-end' }, 'flex-end'),
          createElement('option', { value: 'stretch' }, 'stretch'),
        ),
      ),
      createElement('label', null, 'Justify Content: ',
        createElement('select', {
          value: justifyContent,
          onChange: (e: Event) => setJustifyContent((e.target as HTMLSelectElement).value),
        },
          createElement('option', { value: 'flex-start' }, 'flex-start'),
          createElement('option', { value: 'center' }, 'center'),
          createElement('option', { value: 'flex-end' }, 'flex-end'),
          createElement('option', { value: 'space-between' }, 'space-between'),
          createElement('option', { value: 'space-around' }, 'space-around'),
          createElement('option', { value: 'space-evenly' }, 'space-evenly'),
        ),
      ),
      createElement('label', null, 'Items: ',
        createElement('input', {
          type: 'range', min: '1', max: '12', value: String(itemCount),
          onInput: (e: Event) => setItemCount(Number((e.target as HTMLInputElement).value)),
        }),
        createElement('span', null, ` ${itemCount}`),
      ),
    ),

    createElement(FlexContainer, {
      direction, wrap, gap, alignItems, justifyContent,
      style: { marginTop: '20px', minHeight: '300px', border: '2px dashed #e5e7eb', padding: '12px', borderRadius: '8px' },
    },
      ...Array.from({ length: itemCount }, (_, i) =>
        createElement(FlexItem, {
          key: String(i),
          flex: i === 0 ? '2 1 auto' : '1 1 auto',
          style: {
            backgroundColor: `hsl(${i * 30 + 200}, 70%, 90%)`,
            padding: '16px 24px',
            borderRadius: '6px',
            fontWeight: '600',
          },
        }, `Flex Item ${i + 1}`),
      ),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(FlexDemo, null));
