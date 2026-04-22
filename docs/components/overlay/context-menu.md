# ContextMenu

Right-click context menu with nested submenus and keyboard navigation.

## Import

```typescript
import { ContextMenu } from '@liquidjs/context-menu';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `ContextMenuItem[]` | -- | Menu item definitions |
| `children` | `unknown` | `undefined` | Trigger area children |

### ContextMenuItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `undefined` | Display label |
| `onClick` | `() => void` | `undefined` | Click handler |
| `icon` | `string` | `undefined` | Optional icon (rendered as text/emoji) |
| `disabled` | `boolean` | `false` | Disabled state |
| `divider` | `boolean` | `false` | Render as a divider instead of a menu item |
| `children` | `ContextMenuItem[]` | `undefined` | Nested submenu items |

## Usage

```typescript
import { createElement } from 'liquidjs';
import { ContextMenu } from '@liquidjs/context-menu';

function App() {
  const items = [
    { label: 'Cut', icon: '\\u2702', onClick: () => console.log('Cut') },
    { label: 'Copy', onClick: () => console.log('Copy') },
    { label: 'Paste', onClick: () => console.log('Paste') },
    { divider: true },
    {
      label: 'More',
      children: [
        { label: 'Select All', onClick: () => console.log('Select All') },
        { label: 'Find...', onClick: () => console.log('Find') },
      ],
    },
  ];

  return createElement(ContextMenu, { items },
    createElement('div', { style: { padding: '40px', border: '1px dashed #ccc' } },
      'Right-click here',
    ),
  );
}
```

## Features

- Triggered by right-click (`contextmenu` event) on the child area
- Nested submenus with recursive rendering at arbitrary depth
- Divider items for visual separation between groups
- Optional icons per menu item
- Disabled state support for individual items
- Fixed positioning at the cursor location
- Click-outside to close
- Escape key to close

## Accessibility

- Menu items use `role="menuitem"`
- Container uses `role="menu"`
- Disabled items include `aria-disabled="true"`
- Full keyboard navigation: Arrow Up/Down to move, Arrow Right to open submenu, Arrow Left to close submenu, Enter to activate, Escape to close
