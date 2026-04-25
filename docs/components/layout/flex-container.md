# FlexContainer

Declarative flexbox layout container with direction, wrap, gap, and alignment props.

## Import

```ts
import { FlexContainer, FlexItem } from 'specifyjs/components/layout/flex-container';
```

## Props

### FlexContainer

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `'row' \| 'row-reverse' \| 'column' \| 'column-reverse'` | `'row'` | Flex direction |
| `wrap` | `'nowrap' \| 'wrap' \| 'wrap-reverse'` | `'nowrap'` | Flex wrap behavior |
| `gap` | `string` | -- | Gap between items (CSS value) |
| `alignItems` | `string` | -- | CSS `align-items` |
| `justifyContent` | `string` | -- | CSS `justify-content` |
| `inline` | `boolean` | `false` | Use `inline-flex` instead of `flex` |
| `style` | `Record<string, string>` | -- | Extra inline styles |
| `className` | `string` | -- | Extra class name |
| `children` | `unknown` | -- | Children |

### FlexItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `flex` | `string` | -- | Shorthand `flex` property (e.g. `'1 1 auto'`) |
| `grow` | `number` | -- | `flex-grow` |
| `shrink` | `number` | -- | `flex-shrink` |
| `basis` | `string` | -- | `flex-basis` |
| `alignSelf` | `string` | -- | `align-self` override |
| `order` | `number` | -- | Item `order` |
| `style` | `Record<string, string>` | -- | Extra inline styles |
| `className` | `string` | -- | Extra class name |
| `children` | `unknown` | -- | Children |

## Usage

```ts
import { createElement } from 'specifyjs/core';
import { FlexContainer, FlexItem } from 'specifyjs/components/layout/flex-container';

const toolbar = createElement(
  FlexContainer,
  { direction: 'row', gap: '8px', alignItems: 'center' },
  createElement(FlexItem, { flex: '1' }, 'Title'),
  createElement(FlexItem, null, 'Action'),
);
```

## Variants / Features

### Row layout (default)

Items flow horizontally left-to-right.

```ts
createElement(FlexContainer, { gap: '12px' }, ...children);
```

### Column layout

Stack items vertically.

```ts
createElement(FlexContainer, { direction: 'column', gap: '16px' }, ...children);
```

### Wrapping

Allow items to wrap onto multiple lines.

```ts
createElement(FlexContainer, { wrap: 'wrap', gap: '8px' }, ...children);
```

### Inline flex

Render as an inline-level flex container so it participates in text flow.

```ts
createElement(FlexContainer, { inline: true, gap: '4px' }, ...children);
```

### Per-item control with FlexItem

Override grow, shrink, basis, alignment, and order on individual children.

```ts
createElement(
  FlexContainer,
  { gap: '8px' },
  createElement(FlexItem, { grow: 1, shrink: 0 }, 'Sidebar'),
  createElement(FlexItem, { grow: 3 }, 'Main content'),
);
```

### Alignment

Center items both horizontally and vertically.

```ts
createElement(
  FlexContainer,
  { alignItems: 'center', justifyContent: 'space-between' },
  ...children,
);
```

## Accessibility

- FlexContainer renders a plain `<div>` with `display: flex`. No ARIA roles are applied by default since flexbox is a visual layout mechanism.
- Visual order may differ from DOM order when using `order` or reverse directions. Ensure that the reading order remains logical for screen reader users.
- No keyboard shortcuts are added by the FlexContainer component itself.
