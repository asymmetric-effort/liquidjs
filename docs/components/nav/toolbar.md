# Toolbar

Horizontal toolbar with button groups. Renders a row of buttons, separators (vertical lines), and spacers (flex-grow gaps). Supports size and variant props for consistent toolbar styling.

## Import

```ts
import { Toolbar } from '@specifyjs/components/nav/toolbar';
import type { ToolbarProps, ToolbarItem, ToolbarSize, ToolbarVariant } from '@specifyjs/components/nav/toolbar';
```

## Props

### ToolbarProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `ToolbarItem[]` | *required* | Toolbar items to render. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant controlling height, padding, and font size. |
| `variant` | `'flat' \| 'raised'` | `'flat'` | Visual variant. `flat` has no border/shadow; `raised` has a border and box shadow. |

### ToolbarItem

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | `string` | *required* | Unique identifier. |
| `label` | `string` | `undefined` | Display label (optional if `icon` is provided). |
| `icon` | `string` | `undefined` | Icon text (emoji or character). |
| `type` | `'button' \| 'separator' \| 'dropdown' \| 'spacer'` | *required* | Item type. |
| `onClick` | `() => void` | `undefined` | Click handler (for button and dropdown types). |
| `disabled` | `boolean` | `false` | Whether the item is disabled. |
| `active` | `boolean` | `false` | Whether the item is in an active/pressed state. |

### Size Variants

| Size | Height | Padding | Font Size | Icon Size |
|------|--------|---------|-----------|-----------|
| `sm` | `28px` | `4px 8px` | `12px` | `14px` |
| `md` | `36px` | `6px 12px` | `14px` | `16px` |
| `lg` | `44px` | `8px 16px` | `16px` | `18px` |

## Usage

```ts
import { createElement } from '@specifyjs/core';
import { Toolbar } from '@specifyjs/components/nav/toolbar';

const toolbar = createElement(Toolbar, {
  size: 'md',
  variant: 'raised',
  items: [
    { id: 'bold', type: 'button', icon: 'B', label: 'Bold', onClick: () => console.log('bold') },
    { id: 'italic', type: 'button', icon: 'I', label: 'Italic', onClick: () => console.log('italic') },
    { id: 'sep1', type: 'separator' },
    { id: 'align', type: 'dropdown', label: 'Align', onClick: () => console.log('align') },
    { id: 'spacer1', type: 'spacer' },
    { id: 'save', type: 'button', label: 'Save', onClick: () => console.log('save') },
  ],
});
```

## Features

- **Item types** -- supports buttons, separators (vertical divider lines), dropdown triggers (with a chevron indicator), and spacers (flex-grow gaps for right-alignment).
- **Size variants** -- three sizes (`sm`, `md`, `lg`) controlling height, padding, and font sizing.
- **Visual variants** -- `flat` for borderless toolbars and `raised` for bordered toolbars with box shadows.
- **Active/pressed state** -- buttons can be toggled to an active state with distinct styling.
- **Disabled items** -- buttons can be individually disabled with reduced opacity and non-interactive cursor.
- **Icons and labels** -- buttons can display an icon, a label, or both.
- **Hover feedback** -- buttons show a subtle background change on hover.

## Accessibility

- Wraps content in a NavWrapper with `role="toolbar"` and `aria-label="Toolbar"`.
- Buttons have `aria-pressed` when in the active state.
- Each button has an `aria-label` derived from its label or id, and a `title` attribute for tooltip display.
- Disabled buttons use the native `disabled` attribute.
- Separators use `role="separator"` with `aria-orientation="vertical"`.
- Spacers are hidden from assistive technology with `aria-hidden="true"`.
- Decorative icons are hidden with `aria-hidden="true"`.
- Arrow-key keyboard navigation between toolbar buttons is enabled via NavWrapper's `keyboardNav`.
