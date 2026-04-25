# Breadcrumb

A breadcrumb trail navigation component. Renders an ordered list of navigation links with configurable separators, collapsible middle items, and proper ARIA semantics.

## Import

```ts
import { Breadcrumb } from '@specifyjs/components/nav/breadcrumb';
import type { BreadcrumbProps, BreadcrumbItem, BreadcrumbSize } from '@specifyjs/components/nav/breadcrumb';
```

## Props

### BreadcrumbProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BreadcrumbItem[]` | *required* | Ordered list of breadcrumb items (first = root, last = current page). |
| `separator` | `string \| unknown` | `'/'` | Separator rendered between items. Can be a string or a custom element. |
| `maxItems` | `number` | `undefined` | When set, collapses middle items to "..." if the item count exceeds this value. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant controlling font size and padding. |

### BreadcrumbItem

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | `string` | *required* | Display label. |
| `href` | `string` | `undefined` | Optional link href. If omitted, the item is rendered as plain text or a button. |
| `onClick` | `() => void` | `undefined` | Optional click handler. When combined with `href`, prevents default navigation. |

### Size Variants

| Size | Font Size | Padding |
|------|-----------|---------|
| `sm` | `12px` | `4px 0` |
| `md` | `14px` | `6px 0` |
| `lg` | `16px` | `8px 0` |

## Usage

```ts
import { createElement } from '@specifyjs/core';
import { Breadcrumb } from '@specifyjs/components/nav/breadcrumb';

const breadcrumb = createElement(Breadcrumb, {
  items: [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Widgets', href: '/products/widgets' },
    { label: 'Widget A' },
  ],
  separator: '/',
  maxItems: 3,
  size: 'md',
});
```

## Features

- **Ordered trail** -- renders items in an `<ol>` list reflecting the navigation hierarchy.
- **Configurable separator** -- use a string character or a custom element between items.
- **Collapsible middle items** -- when `maxItems` is set and the item count exceeds it, middle items collapse to an expandable "..." button.
- **Size variants** -- three sizes (`sm`, `md`, `lg`) for different UI contexts.
- **Link and button items** -- items with `href` render as `<a>` tags; items with only `onClick` render as `<button>` elements; items with neither render as plain `<span>` text.
- **Current page highlighting** -- the last item is displayed with bold text and no link.

## Accessibility

- Wraps content in a NavWrapper with `role="navigation"` and `aria-label="Breadcrumb"`.
- Items are rendered inside an `<ol>` element for proper semantic structure.
- The last item (current page) is marked with `aria-current="page"`.
- Separators are hidden from assistive technology with `aria-hidden="true"`.
- The collapsible ellipsis button has `aria-label="Show all breadcrumb items"` for screen reader users.
- All interactive items (links and buttons) are keyboard-focusable.
