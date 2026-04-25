import { createElement } from 'specifyjs';
import { useState, useCallback } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { DataGrid } from '../../../../components/data/data-grid/src/index';
import type { DataGridColumn } from '../../../../components/data/data-grid/src/index';

// ── Sample Data ────────────────────────────────────────────────────────

interface Employee {
  id: number;
  name: string;
  department: string;
  salary: number;
  location: string;
  startDate: string;
}

const employees: Employee[] = [
  { id: 1, name: 'Alice Johnson', department: 'Engineering', salary: 120000, location: 'New York', startDate: '2021-03-15' },
  { id: 2, name: 'Bob Smith', department: 'Marketing', salary: 85000, location: 'Chicago', startDate: '2020-07-01' },
  { id: 3, name: 'Charlie Brown', department: 'Engineering', salary: 110000, location: 'San Francisco', startDate: '2022-01-10' },
  { id: 4, name: 'Diana Prince', department: 'HR', salary: 95000, location: 'New York', startDate: '2019-11-20' },
  { id: 5, name: 'Eve Davis', department: 'Engineering', salary: 130000, location: 'Seattle', startDate: '2023-02-28' },
  { id: 6, name: 'Frank Miller', department: 'Sales', salary: 78000, location: 'Boston', startDate: '2021-08-05' },
  { id: 7, name: 'Grace Lee', department: 'Marketing', salary: 92000, location: 'Los Angeles', startDate: '2020-04-12' },
  { id: 8, name: 'Hank Wilson', department: 'Engineering', salary: 115000, location: 'Austin', startDate: '2022-06-01' },
  { id: 9, name: 'Ivy Chen', department: 'HR', salary: 88000, location: 'Denver', startDate: '2021-10-15' },
  { id: 10, name: 'Jack Taylor', department: 'Sales', salary: 82000, location: 'Miami', startDate: '2023-05-20' },
  { id: 11, name: 'Karen White', department: 'Engineering', salary: 125000, location: 'Portland', startDate: '2020-01-08' },
  { id: 12, name: 'Leo Garcia', department: 'Marketing', salary: 90000, location: 'Phoenix', startDate: '2022-09-14' },
];

// ── Demo App ───────────────────────────────────────────────────────────

function DataGridDemo() {
  const [currentPage, setCurrentPage] = useState(0);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [striped, setStriped] = useState(true);
  const [bordered, setBordered] = useState(false);
  const [compact, setCompact] = useState(false);
  const [selectable, setSelectable] = useState(true);
  const [pageSize, setPageSize] = useState(5);

  const handleSort = useCallback((col: string, dir: 'asc' | 'desc') => {
    setSortBy(col);
    setSortDir(dir);
  }, []);

  const columns: DataGridColumn[] = [
    { key: 'name', header: 'Name', sortable: true, filterable: true, width: '180px' },
    { key: 'department', header: 'Department', sortable: true, filterable: true },
    {
      key: 'salary',
      header: 'Salary',
      sortable: true,
      render: (v: unknown) => `$${(v as number).toLocaleString()}`,
    },
    { key: 'location', header: 'Location', sortable: true },
    { key: 'startDate', header: 'Start Date', sortable: true },
  ];

  const toggleStyle = {
    padding: '6px 14px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    marginRight: '8px',
  };

  const activeToggleStyle = {
    ...toggleStyle,
    backgroundColor: '#3b82f6',
    color: '#fff',
    borderColor: '#3b82f6',
  };

  return createElement('div', {
    style: { maxWidth: '1000px', margin: '0 auto', padding: '32px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  },
    createElement('h1', { style: { fontSize: '24px', marginBottom: '8px' } }, 'DataGrid Demo'),
    createElement('p', { style: { color: '#6b7280', marginBottom: '24px' } },
      'Full-featured data table with sorting, filtering, pagination, and row selection.',
    ),

    // Controls
    createElement('div', { style: { marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' } },
      createElement('button', {
        style: striped ? activeToggleStyle : toggleStyle,
        onClick: () => setStriped((s: boolean) => !s),
      }, 'Striped'),
      createElement('button', {
        style: bordered ? activeToggleStyle : toggleStyle,
        onClick: () => setBordered((b: boolean) => !b),
      }, 'Bordered'),
      createElement('button', {
        style: compact ? activeToggleStyle : toggleStyle,
        onClick: () => setCompact((c: boolean) => !c),
      }, 'Compact'),
      createElement('button', {
        style: selectable ? activeToggleStyle : toggleStyle,
        onClick: () => setSelectable((s: boolean) => !s),
      }, 'Selectable'),
      createElement('label', { style: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' } },
        'Page size:',
        createElement('select', {
          value: String(pageSize),
          onChange: (e: Event) => {
            setPageSize(parseInt((e.target as HTMLSelectElement).value, 10));
            setCurrentPage(0);
          },
          style: { padding: '4px 8px', borderRadius: '4px', border: '1px solid #d1d5db' },
        },
          createElement('option', { value: '3' }, '3'),
          createElement('option', { value: '5' }, '5'),
          createElement('option', { value: '10' }, '10'),
        ),
      ),
    ),

    // Selected rows info
    selectable && selectedRows.length > 0
      ? createElement('div', { style: { padding: '8px 12px', backgroundColor: '#eff6ff', borderRadius: '6px', marginBottom: '12px', fontSize: '13px' } },
          `${selectedRows.length} row(s) selected: indices [${selectedRows.join(', ')}]`,
        )
      : null,

    // DataGrid
    createElement(DataGrid, {
      columns,
      data: employees as unknown as Record<string, unknown>[],
      pageSize,
      currentPage,
      onPageChange: setCurrentPage,
      sortBy,
      sortDir,
      onSort: handleSort,
      selectable,
      selectedRows,
      onSelectionChange: setSelectedRows,
      striped,
      bordered,
      compact,
      stickyHeader: true,
    }),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(DataGridDemo, null));
