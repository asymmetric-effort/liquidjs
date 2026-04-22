# Pagination

Page navigation component. Renders First, Previous, page number buttons with ellipsis gaps, Next, and Last controls for navigating paginated data.

## Import

```ts
import { Pagination } from '@liquidjs/components/nav/pagination';
import type { PaginationProps } from '@liquidjs/components/nav/pagination';
```

## Props

### PaginationProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `total` | `number` | *required* | Total number of items. |
| `pageSize` | `number` | *required* | Items per page. |
| `currentPage` | `number` | *required* | Current active page (1-based). |
| `onChange` | `(page: number) => void` | *required* | Called when the page changes. |
| `siblingCount` | `number` | `1` | Number of sibling pages shown around the current page. |
| `showFirstLast` | `boolean` | `true` | Show First/Last navigation buttons. |
| `showPrevNext` | `boolean` | `true` | Show Previous/Next navigation buttons. |
| `disabled` | `boolean` | `false` | Disable all controls. |

## Usage

```ts
import { createElement } from '@liquidjs/core';
import { Pagination } from '@liquidjs/components/nav/pagination';

const pagination = createElement(Pagination, {
  total: 200,
  pageSize: 10,
  currentPage: 5,
  siblingCount: 1,
  showFirstLast: true,
  showPrevNext: true,
  onChange: (page) => console.log('Navigate to page:', page),
});
```

## Features

- **Smart page range** -- displays page numbers with ellipsis gaps to avoid rendering every page number when the total page count is large.
- **Sibling count** -- configurable number of page buttons shown on each side of the current page.
- **First/Last buttons** -- optional buttons to jump to the first or last page.
- **Previous/Next buttons** -- optional buttons for sequential page navigation.
- **Disabled state** -- all controls can be globally disabled.
- **Boundary protection** -- navigation buttons are automatically disabled when at the first or last page.
- **Active page styling** -- the current page button is visually distinct with a blue background and bold text.
- **Horizontal layout** -- rendered as a horizontal row using NavWrapper with gap spacing.

## Accessibility

- Wraps content in a NavWrapper with `role="navigation"` and `aria-label="Pagination"`.
- The current page button is marked with `aria-current="page"`.
- First, Last, Previous, and Next buttons each have descriptive `aria-label` attributes (e.g., "Go to first page", "Go to previous page").
- Page number buttons have `aria-label="Page N"` for each page number.
- Disabled buttons use the native `disabled` attribute.
- Arrow-key keyboard navigation between buttons is enabled via NavWrapper's `keyboardNav`.
