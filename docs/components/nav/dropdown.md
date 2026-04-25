# Dropdown

A dropdown menu navigation component. Renders a trigger button that toggles a dropdown panel containing menu items. Supports nested submenus, dividers, icons, disabled states, and keyboard dismissal.

## Import

```ts
import { Dropdown } from '@specifyjs/components/nav/dropdown';
import type { DropdownProps, DropdownItem } from '@specifyjs/components/nav/dropdown';
```

## Props

### DropdownProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | *required* | Text displayed on the trigger button. |
| `items` | `DropdownItem[]` | *required* | Array of menu items to display. |
| `triggerStyle` | `Record<string, string>` | `undefined` | Custom inline styles for the trigger button. |
| `menuStyle` | `NavWrapperStyle` | `undefined` | Styling passed to NavWrapper for the dropdown panel. |
| `itemStyle` | `NavItemStyle` | `{}` | Styling for individual menu items. |
| `placement` | `'bottom-start' \| 'bottom-end'` | `'bottom-start'` | Placement of the dropdown relative to the trigger. |
| `closeOnSelect` | `boolean` | `true` | Close the dropdown when an item is selected. |
| `width` | `string \| number` | `'220px'` | Width of the dropdown panel. |

### DropdownItem

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | `string` | *required* | Unique identifier for the item. |
| `label` | `string` | *required* | Display label. |
| `icon` | `string` | `undefined` | Icon rendered as a text span before the label (emoji or text). |
| `disabled` | `boolean` | `false` | Whether the item is disabled (grayed out, non-interactive). |
| `divider` | `boolean` | `false` | Render as a thin horizontal divider instead of a menu item. |
| `onClick` | `() => void` | `undefined` | Click handler. |
| `children` | `DropdownItem[]` | `undefined` | Nested submenu items -- shows a right chevron and expands on hover. |

## Usage

```ts
import { createElement } from '@specifyjs/core';
import { Dropdown } from '@specifyjs/components/nav/dropdown';

const menu = createElement(Dropdown, {
  label: 'Actions',
  placement: 'bottom-start',
  items: [
    { id: 'edit', label: 'Edit', icon: 'E', onClick: () => console.log('edit') },
    { id: 'copy', label: 'Copy', icon: 'C', onClick: () => console.log('copy') },
    { id: 'div1', label: '', divider: true },
    { id: 'delete', label: 'Delete', icon: 'D', disabled: true },
    {
      id: 'more',
      label: 'More options',
      children: [
        { id: 'export', label: 'Export', onClick: () => console.log('export') },
        { id: 'archive', label: 'Archive', onClick: () => console.log('archive') },
      ],
    },
  ],
});
```

## Features

- **Trigger button** -- styled button with a rotating chevron indicator for open/closed state.
- **Nested submenus** -- items with `children` display a right chevron and expand on hover, positioned to the right of the parent item.
- **Dividers** -- items with `divider: true` render as a horizontal separator line.
- **Icons** -- optional icon text displayed before the label.
- **Disabled items** -- grayed out and non-interactive, with reduced opacity and `aria-disabled`.
- **Close on outside click** -- clicking outside the dropdown dismisses it.
- **Escape key dismissal** -- pressing Escape closes the dropdown.
- **Configurable placement** -- dropdown panel can align to the start or end of the trigger.
- **Close on select** -- optionally close the menu when an item is clicked.

## Accessibility

- Trigger button has `aria-haspopup="true"` and `aria-expanded` reflecting the open state.
- The dropdown panel uses `role="menu"` with an `aria-label` derived from the trigger label.
- Each menu item uses `role="menuitem"`.
- Disabled items are marked with `aria-disabled` and have `tabIndex: -1`.
- Items with submenus have `aria-haspopup` and `aria-expanded` attributes.
- Dividers use `role="separator"`.
- Decorative icons are hidden from assistive technology with `aria-hidden="true"`.
