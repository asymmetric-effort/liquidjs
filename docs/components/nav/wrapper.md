# NavWrapper

Base container for all navigation components. Provides consistent layout, orientation, ARIA roles, focus management, and configurable styling. All nav components (Dropdown, TreeNav, Accordion, etc.) build on this foundation.

## Import

```ts
import { NavWrapper, buildNavItemStyle, useHover } from '@liquidjs/components/nav/wrapper';
import type { NavWrapperProps, NavWrapperStyle, NavOrientation, NavItemStyle } from '@liquidjs/components/nav/wrapper';
```

## Props

### NavWrapperProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `'horizontal' \| 'vertical'` | `'vertical'` | Orientation of child items. |
| `role` | `string` | `'navigation'` | ARIA role applied to the container. |
| `ariaLabel` | `string` | `undefined` | ARIA label for the navigation landmark. |
| `styling` | `NavWrapperStyle` | `{}` | Styling configuration object (see below). |
| `className` | `string` | `''` | Extra CSS class name appended to the container. |
| `keyboardNav` | `boolean` | `true` | Enable arrow-key navigation between focusable children. |
| `children` | `unknown` | `undefined` | Child elements to render inside the wrapper. |

### NavWrapperStyle

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `backgroundColor` | `string` | `'#ffffff'` | Background color. |
| `color` | `string` | `'#1f2937'` | Text color. |
| `fontFamily` | `string` | `'inherit'` | Font family. |
| `fontSize` | `string` | `'14px'` | Font size. |
| `border` | `string` | `'1px solid #e5e7eb'` | Border style. |
| `borderRadius` | `string` | `'8px'` | Border radius. |
| `padding` | `string` | `'0'` | Padding. |
| `boxShadow` | `string` | `undefined` | Box shadow. |
| `width` | `string \| number` | `'auto'` | Container width. |
| `maxHeight` | `string \| number` | `undefined` | Max height for scrollable content. |
| `custom` | `Record<string, string>` | `undefined` | Custom inline styles merged last. |

### NavItemStyle

Shared style configuration used by nav item helpers across all components.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `padding` | `string` | `'10px 16px'` | Item padding. |
| `hoverBackground` | `string` | `'#f3f4f6'` | Background on hover. |
| `activeBackground` | `string` | `'#eff6ff'` | Background when active/selected. |
| `activeColor` | `string` | `'#2563eb'` | Text color when active/selected. |
| `separator` | `string` | `undefined` | Border bottom between items. |
| `cursor` | `string` | `'pointer'` | Cursor style. |
| `transition` | `string` | `'background-color 0.15s'` | CSS transition. |

## Usage

```ts
import { createElement } from '@liquidjs/core';
import { NavWrapper } from '@liquidjs/components/nav/wrapper';

const nav = createElement(
  NavWrapper,
  {
    orientation: 'vertical',
    ariaLabel: 'Main navigation',
    styling: {
      width: '260px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
  },
  createElement('button', { role: 'menuitem' }, 'Dashboard'),
  createElement('button', { role: 'menuitem' }, 'Settings'),
  createElement('button', { role: 'menuitem' }, 'Profile'),
);
```

## Features

- **Orientation support** -- renders as a flex row (horizontal) or column (vertical).
- **Keyboard navigation** -- arrow keys move focus between focusable children; Home/End jump to first/last item.
- **Configurable styling** -- comprehensive style object with sensible defaults and a `custom` escape hatch.
- **Shared utilities** -- exports `buildNavItemStyle` for consistent item styling and `useHover` for hover state management.
- **Foundation component** -- used internally by Dropdown, TreeNav, Accordion, Breadcrumb, Pagination, Sidebar, and Toolbar.

## Accessibility

- Renders a `<nav>` element with a configurable `role` attribute (defaults to `'navigation'`).
- Supports `aria-label` for screen reader identification of the navigation landmark.
- Sets `aria-orientation` to communicate layout direction to assistive technology.
- Keyboard navigation via arrow keys respects the orientation (Up/Down for vertical, Left/Right for horizontal).
- Home and End keys move focus to the first and last focusable items respectively.
- Focusable children are queried using standard selectors: `button`, `[tabindex]`, `a[href]`, `[role="menuitem"]`, `[role="treeitem"]`.
