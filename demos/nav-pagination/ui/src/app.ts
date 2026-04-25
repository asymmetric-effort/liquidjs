import { createElement } from 'specifyjs';
import { useState, useCallback } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { Pagination } from '../../../../components/nav/pagination/src/index';

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [disabled, setDisabled] = useState(false);
  const total = 237;

  const handleChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const items = Array.from({ length: total }, (_, i) => `Item ${i + 1}`);
  const startIdx = (currentPage - 1) * pageSize;
  const pageItems = items.slice(startIdx, startIdx + pageSize);

  return createElement(
    'div',
    { style: { padding: '40px', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' } },
    createElement('h1', null, 'Pagination Demo'),

    createElement(
      'div',
      { style: { display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'center' } },
      createElement(
        'label',
        { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
        'Page size:',
        createElement('select', {
          value: String(pageSize),
          onChange: (e: Event) => {
            setPageSize(Number((e.target as HTMLSelectElement).value));
            setCurrentPage(1);
          },
          style: { padding: '4px 8px', borderRadius: '4px', border: '1px solid #d1d5db' },
        },
          createElement('option', { value: '5' }, '5'),
          createElement('option', { value: '10' }, '10'),
          createElement('option', { value: '25' }, '25'),
          createElement('option', { value: '50' }, '50'),
        ),
      ),
      createElement(
        'label',
        { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
        createElement('input', {
          type: 'checkbox',
          checked: disabled,
          onChange: () => setDisabled((d: boolean) => !d),
        }),
        'Disabled',
      ),
    ),

    createElement(
      'div',
      { style: { marginBottom: '16px', padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '8px' } },
      createElement('strong', null, `Showing ${startIdx + 1}-${Math.min(startIdx + pageSize, total)} of ${total} items`),
    ),

    createElement(
      'ul',
      { style: { listStyle: 'none', padding: '0', marginBottom: '20px' } },
      ...pageItems.map((item) =>
        createElement('li', {
          key: item,
          style: { padding: '8px 12px', borderBottom: '1px solid #e5e7eb' },
        }, item),
      ),
    ),

    createElement(Pagination, {
      total,
      pageSize,
      currentPage,
      onChange: handleChange,
      disabled,
    }),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
