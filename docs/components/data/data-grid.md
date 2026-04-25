# DataGrid

Full-featured data table/grid with sorting, pagination, selection, filtering, and sticky header support.

## Import

```typescript
import { DataGrid } from '@specifyjs/data-grid';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `DataGridColumn[]` | -- | Column definitions |
| `data` | `Record<string, unknown>[]` | -- | Row data |
| `pageSize` | `number` | `undefined` | Rows per page (enables pagination when set) |
| `currentPage` | `number` | `0` | Current page index (0-based) |
| `onPageChange` | `(page: number) => void` | `undefined` | Page change handler |
| `sortBy` | `string` | `undefined` | Current sort column key |
| `sortDir` | `'asc' \| 'desc'` | `'asc'` | Sort direction |
| `onSort` | `(key: string, dir: 'asc' \| 'desc') => void` | `undefined` | Sort change handler |
| `selectable` | `boolean` | `false` | Enable row selection checkboxes |
| `selectedRows` | `number[]` | `[]` | Currently selected row indices |
| `onSelectionChange` | `(indices: number[]) => void` | `undefined` | Selection change handler |
| `striped` | `boolean` | `false` | Alternate row background colors |
| `bordered` | `boolean` | `false` | Show cell borders |
| `compact` | `boolean` | `false` | Compact row height |
| `stickyHeader` | `boolean` | `false` | Sticky header on scroll |

### DataGridColumn

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `key` | `string` | -- | Property key in the row data |
| `header` | `string` | -- | Display header text |
| `width` | `string` | `undefined` | Column width (CSS value) |
| `sortable` | `boolean` | `false` | Whether this column is sortable |
| `filterable` | `boolean` | `false` | Whether this column shows a filter input |
| `render` | `(value: unknown, row: Record<string, unknown>) => unknown` | `undefined` | Custom cell renderer |

## Usage

```typescript
import { createElement } from 'specifyjs';
import { DataGrid } from '@specifyjs/data-grid';

function App() {
  const columns = [
    { key: 'name', header: 'Name', sortable: true, filterable: true },
    { key: 'email', header: 'Email', width: '250px' },
    { key: 'role', header: 'Role', sortable: true },
  ];

  const data = [
    { name: 'Alice', email: 'alice@example.com', role: 'Admin' },
    { name: 'Bob', email: 'bob@example.com', role: 'User' },
  ];

  return createElement(DataGrid, {
    columns,
    data,
    pageSize: 10,
    selectable: true,
    striped: true,
    stickyHeader: true,
  });
}
```

## Features

- Column-based sorting with ascending/descending toggle and sort indicators
- Per-column text filtering with automatic first-page reset
- Pagination with page number buttons, prev/next, and ellipsis for large page counts
- Row selection with individual and select-all checkboxes
- Supports both controlled and uncontrolled modes for sort, page, and selection
- Striped rows, bordered cells, and compact mode styling options
- Sticky header for scrollable grids
- Custom cell renderers per column

## Accessibility

- Table uses `role="grid"` with `aria-rowcount`
- Sort headers include `aria-sort` (`ascending` / `descending`)
- Checkboxes include `aria-label` for "Select all rows" and "Select row N"
- Filter inputs include `aria-label` for "Filter by {column}"
- Pagination buttons include `aria-label` for "Previous page" / "Next page"
- Active page uses `aria-current="page"`
