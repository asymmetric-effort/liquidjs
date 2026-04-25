# ListView

Styled list with configurable item rendering, dividers, selection, hover effects, and optional header/footer.

## Import

```typescript
import { ListView } from '@specifyjs/list-view';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `unknown[]` | -- | Array of items to render |
| `renderItem` | `(item: unknown, index: number) => unknown` | -- | Render function for each item |
| `keyExtractor` | `(item: unknown, index: number) => string` | -- | Unique key extractor per item |
| `divider` | `boolean` | `false` | Show divider between items |
| `hoverable` | `boolean` | `false` | Highlight items on hover |
| `selectedIndex` | `number` | `undefined` | Currently selected item index |
| `onSelect` | `(index: number) => void` | `undefined` | Selection handler |
| `emptyMessage` | `string` | `'No items'` | Message shown when items is empty |
| `header` | `unknown` | `undefined` | Optional header element |
| `footer` | `unknown` | `undefined` | Optional footer element |

## Usage

```typescript
import { createElement } from 'specifyjs';
import { ListView } from '@specifyjs/list-view';

function App() {
  const items = ['Apple', 'Banana', 'Cherry'];

  return createElement(ListView, {
    items,
    renderItem: (item, index) => createElement('span', null, item),
    keyExtractor: (item, index) => String(index),
    divider: true,
    hoverable: true,
    onSelect: (index) => console.log('Selected:', index),
    header: 'Fruits',
    emptyMessage: 'No fruits available',
  });
}
```

## Features

- Custom render function for each list item
- Dividers between items (last item excluded)
- Hover highlight with CSS transition
- Single-item selection with visual highlight
- Empty state message when no items are present
- Optional header and footer sections with distinct styling
- Flexible key extraction for efficient reconciliation

## Accessibility

- Uses `role="listbox"` when `onSelect` is provided, `role="list"` otherwise
- Selectable items use `role="option"` with `aria-selected`
