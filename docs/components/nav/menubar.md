# Menubar

Horizontal menu bar with dropdown menus. Renders a bar of top-level menu triggers that open dropdown panels on click or hover. Supports menu items with shortcuts, icons, dividers, disabled states, and nested submenus. Full keyboard navigation with arrow keys.

## Import

```ts
import { Menubar } from '@liquidjs/components/nav/menubar';
import type { MenubarProps, MenuDefinition, MenuItem } from '@liquidjs/components/nav/menubar';
```

## Props

### MenubarProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `menus` | `MenuDefinition[]` | *required* | Array of top-level menu definitions. |

### MenuDefinition

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | `string` | *required* | Top-level menu trigger label. |
| `items` | `MenuItem[]` | *required* | Items displayed in this menu's dropdown panel. |

### MenuItem

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | `string` | *required* | Display label. |
| `onClick` | `() => void` | `undefined` | Click handler. |
| `shortcut` | `string` | `undefined` | Keyboard shortcut hint (e.g., `'Ctrl+S'`). |
| `icon` | `string` | `undefined` | Icon text (emoji or character). |
| `divider` | `boolean` | `false` | Render as a horizontal divider line. |
| `disabled` | `boolean` | `false` | Whether the item is disabled. |
| `children` | `MenuItem[]` | `undefined` | Nested submenu items. |

## Usage

```ts
import { createElement } from '@liquidjs/core';
import { Menubar } from '@liquidjs/components/nav/menubar';

const menubar = createElement(Menubar, {
  menus: [
    {
      label: 'File',
      items: [
        { label: 'New', shortcut: 'Ctrl+N', onClick: () => console.log('new') },
        { label: 'Open', shortcut: 'Ctrl+O', onClick: () => console.log('open') },
        { label: 'Save', shortcut: 'Ctrl+S', onClick: () => console.log('save') },
        { label: '', divider: true },
        { label: 'Exit', onClick: () => console.log('exit') },
      ],
    },
    {
      label: 'Edit',
      items: [
        { label: 'Undo', shortcut: 'Ctrl+Z', onClick: () => console.log('undo') },
        { label: 'Redo', shortcut: 'Ctrl+Y', onClick: () => console.log('redo') },
        { label: '', divider: true },
        { label: 'Cut', shortcut: 'Ctrl+X' },
        { label: 'Copy', shortcut: 'Ctrl+C' },
        { label: 'Paste', shortcut: 'Ctrl+V' },
      ],
    },
    {
      label: 'View',
      items: [
        {
          label: 'Zoom',
          children: [
            { label: 'Zoom In', shortcut: 'Ctrl++' },
            { label: 'Zoom Out', shortcut: 'Ctrl+-' },
            { label: 'Reset Zoom', shortcut: 'Ctrl+0' },
          ],
        },
        { label: 'Full Screen', shortcut: 'F11' },
      ],
    },
  ],
});
```

## Features

- **Top-level menu triggers** -- horizontal bar of clickable menu labels with hover highlighting.
- **Hover switching** -- when any menu is open, hovering over another trigger immediately switches to that menu.
- **Nested submenus** -- menu items with `children` expand to a submenu panel on hover, positioned to the right.
- **Keyboard shortcut hints** -- items can display a right-aligned shortcut string (e.g., `'Ctrl+S'`).
- **Icons** -- optional icon text rendered before the label with a fixed-width slot for alignment.
- **Dividers** -- items with `divider: true` render as horizontal separator lines.
- **Disabled items** -- grayed out and non-interactive.
- **Close on outside click** -- clicking outside the menubar dismisses any open menu.
- **Escape key dismissal** -- pressing Escape closes the open menu.

## Accessibility

- The menubar container uses `role="menubar"` with `aria-label="Menu bar"`.
- Top-level triggers use `role="menuitem"` with `aria-haspopup="true"` and `aria-expanded` reflecting the open state.
- Dropdown panels use `role="menu"` with an `aria-label` derived from the menu label.
- Menu items use `role="menuitem"`.
- Disabled items are marked with `aria-disabled`.
- Items with submenus have `aria-haspopup` and `aria-expanded` attributes.
- Dividers use `role="separator"`.
- Full keyboard navigation: ArrowLeft/ArrowRight cycle through top-level menus, ArrowDown focuses the first item in an open menu, Escape closes the menu.
- Decorative icons and submenu chevrons are hidden from assistive technology with `aria-hidden="true"`.
