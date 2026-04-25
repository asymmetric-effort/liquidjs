import { createElement } from 'specifyjs';
import { useState } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { Grid, GridItem } from '../../../../components/layout/grid/src/index';

function GridDemo() {
  const [columns, setColumns] = useState(3);
  const [gap, setGap] = useState('16px');
  const [useAutoFit, setUseAutoFit] = useState(false);
  const [minColWidth, setMinColWidth] = useState('200px');
  const [alignItems, setAlignItems] = useState('stretch');

  const items = Array.from({ length: 9 }, (_, i) => i + 1);

  return createElement('div', { className: 'demo-app' },
    createElement('h1', null, 'Grid Component Demo'),

    createElement('div', { className: 'controls' },
      createElement('label', null, 'Columns: ',
        createElement('input', {
          type: 'range', min: '1', max: '6', value: String(columns),
          onInput: (e: Event) => setColumns(Number((e.target as HTMLInputElement).value)),
        }),
        createElement('span', null, ` ${columns}`),
      ),
      createElement('label', null, 'Gap: ',
        createElement('select', {
          value: gap,
          onChange: (e: Event) => setGap((e.target as HTMLSelectElement).value),
        },
          createElement('option', { value: '0px' }, '0px'),
          createElement('option', { value: '8px' }, '8px'),
          createElement('option', { value: '16px' }, '16px'),
          createElement('option', { value: '24px' }, '24px'),
        ),
      ),
      createElement('label', null,
        createElement('input', {
          type: 'checkbox', checked: useAutoFit,
          onChange: () => setUseAutoFit((v: boolean) => !v),
        }),
        ' Auto-fit',
      ),
      useAutoFit ? createElement('label', null, 'Min col width: ',
        createElement('input', {
          type: 'text', value: minColWidth,
          onInput: (e: Event) => setMinColWidth((e.target as HTMLInputElement).value),
        }),
      ) : null,
      createElement('label', null, 'Align Items: ',
        createElement('select', {
          value: alignItems,
          onChange: (e: Event) => setAlignItems((e.target as HTMLSelectElement).value),
        },
          createElement('option', { value: 'stretch' }, 'stretch'),
          createElement('option', { value: 'start' }, 'start'),
          createElement('option', { value: 'center' }, 'center'),
          createElement('option', { value: 'end' }, 'end'),
        ),
      ),
    ),

    createElement(Grid, {
      columns: useAutoFit ? undefined : columns,
      gap,
      minColWidth: useAutoFit ? minColWidth : undefined,
      alignItems,
      style: { marginTop: '20px' },
    },
      ...items.map((n) =>
        createElement(GridItem, {
          key: String(n),
          gridColumn: n === 1 ? 'span 2' : undefined,
          style: {
            backgroundColor: `hsl(${n * 40}, 70%, 90%)`,
            padding: '24px',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: '600',
          },
        }, `Item ${n}`),
      ),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(GridDemo, null));
