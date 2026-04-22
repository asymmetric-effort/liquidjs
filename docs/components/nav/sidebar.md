# Sidebar

Collapsible sidebar navigation component. Renders a vertical navigation panel with nested sections, badge indicators, icon-only collapsed mode, and tooltip labels when collapsed.

## Import

```ts
import { Sidebar } from '@liquidjs/components/nav/sidebar';
import type { SidebarProps, SidebarItem } from '@liquidjs/components/nav/sidebar';
```

## Props

### SidebarProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `SidebarItem[]` | *required* | Navigation items to render. |
| `collapsed` | `boolean` | `false` | Whether the sidebar is collapsed to icon-only mode. |
| `onToggleCollapse` | `() => void` | `undefined` | Called to toggle the collapse state. When provided, a toggle button is rendered. |
| `selectedId` | `string` | `undefined` | ID of the currently selected item. |
| `onSelect` | `(id: string) => void` | `undefined` | Called when an item is selected. |
| `width` | `string \| number` | `'240px'` | Expanded sidebar width. |
| `collapsedWidth` | `string \| number` | `'56px'` | Collapsed sidebar width. |

### SidebarItem

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | `string` | *required* | Unique identifier. |
| `label` | `string` | *required* | Display label. |
| `icon` | `string` | `undefined` | Optional icon (emoji or text character). |
| `children` | `SidebarItem[]` | `undefined` | Nested child items. |
| `badge` | `string` | `undefined` | Optional badge text (e.g., a count) displayed as a red pill. |

## Usage

```ts
import { createElement } from '@liquidjs/core';
import { Sidebar } from '@liquidjs/components/nav/sidebar';

const sidebar = createElement(Sidebar, {
  items: [
    { id: 'dashboard', label: 'Dashboard', icon: 'D' },
    { id: 'inbox', label: 'Inbox', icon: 'I', badge: '12' },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'S',
      children: [
        { id: 'general', label: 'General' },
        { id: 'security', label: 'Security' },
      ],
    },
  ],
  selectedId: 'dashboard',
  collapsed: false,
  onToggleCollapse: () => console.log('Toggle sidebar'),
  onSelect: (id) => console.log('Selected:', id),
  width: '240px',
  collapsedWidth: '56px',
});
```

## Features

- **Collapsible mode** -- toggle between full-width labels and icon-only mode with smooth width transition.
- **Nested items** -- child items expand/collapse on click with a rotating chevron indicator.
- **Badge indicators** -- items can display a red badge pill (e.g., unread counts).
- **Tooltips when collapsed** -- hovering over an icon-only item shows a tooltip with the item label.
- **Toggle button** -- when `onToggleCollapse` is provided, a toggle button is rendered at the top of the sidebar.
- **Selected state** -- the selected item is highlighted with a blue background and text color.
- **Hover feedback** -- items show a subtle background change on hover.
- **Depth indentation** -- nested items are progressively indented based on their depth level.
- **Animated width transition** -- the sidebar width animates when toggling between collapsed and expanded states.

## Accessibility

- Wraps content in a NavWrapper with `role="navigation"` and `aria-label="Sidebar"`.
- The collapse toggle button has `aria-label` that reflects the current state ("Expand sidebar" or "Collapse sidebar").
- Selected items are marked with `aria-selected`.
- In collapsed mode, each item has a `title` attribute for native browser tooltips.
- Tooltip elements use `role="tooltip"`.
- Nested child groups are wrapped in a `role="group"` container.
- All items are rendered as `<button>` elements for keyboard accessibility.
- Arrow-key keyboard navigation is enabled via NavWrapper's `keyboardNav`.
