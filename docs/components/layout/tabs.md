# Tabs

Tabbed content container with configurable position, visual variant, keyboard navigation, and full ARIA support.

## Import

```ts
import { Tabs } from 'liquidjs/components/layout/tabs';
```

## Props

### Tabs

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `TabDefinition[]` | -- | Tab definitions (required) |
| `activeTab` | `string` | -- | Controlled active tab id. When omitted, the component manages its own state. |
| `onChange` | `(tabId: string) => void` | -- | Callback invoked when the active tab changes |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Position of the tab list relative to the panel |
| `variant` | `'line' \| 'card' \| 'pill'` | `'line'` | Visual style of the tab buttons |
| `style` | `Record<string, string>` | -- | Extra inline styles |
| `className` | `string` | -- | Extra class name |

### TabDefinition

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | -- | Unique tab identifier (required) |
| `label` | `string` | -- | Display label (required) |
| `icon` | `unknown` | -- | Optional icon element |
| `disabled` | `boolean` | `false` | Disabled state |
| `content` | `unknown` | -- | Tab panel content (required) |

## Usage

```ts
import { createElement } from 'liquidjs/core';
import { Tabs } from 'liquidjs/components/layout/tabs';

const tabView = createElement(Tabs, {
  tabs: [
    { id: 'overview', label: 'Overview', content: 'Overview content here' },
    { id: 'details', label: 'Details', content: 'Detailed information' },
    { id: 'settings', label: 'Settings', content: 'Settings panel' },
  ],
});
```

## Variants / Features

### Line variant (default)

An underline indicator marks the active tab.

```ts
createElement(Tabs, { variant: 'line', tabs: [...] });
```

### Card variant

Active tab appears as a raised card with a border, visually connected to the panel.

```ts
createElement(Tabs, { variant: 'card', tabs: [...] });
```

### Pill variant

Active tab is highlighted with a filled pill/capsule shape.

```ts
createElement(Tabs, { variant: 'pill', tabs: [...] });
```

### Tab list position

Place the tab list on any side of the content panel.

```ts
createElement(Tabs, { position: 'left', tabs: [...] });
createElement(Tabs, { position: 'bottom', tabs: [...] });
```

### Disabled tabs

Individual tabs can be disabled. Disabled tabs cannot be selected via click or keyboard.

```ts
createElement(Tabs, {
  tabs: [
    { id: 'a', label: 'Active', content: '...' },
    { id: 'b', label: 'Disabled', disabled: true, content: '...' },
  ],
});
```

### Tabs with icons

```ts
createElement(Tabs, {
  tabs: [
    { id: 'home', label: 'Home', icon: createElement('span', null, 'icon'), content: '...' },
  ],
});
```

### Controlled mode

Pass `activeTab` and `onChange` to control the active tab externally.

```ts
createElement(Tabs, {
  activeTab: currentTab,
  onChange: (id) => setCurrentTab(id),
  tabs: [...],
});
```

## Accessibility

- The tab list container has `role="tablist"` with `aria-orientation` set to `"horizontal"` or `"vertical"` depending on the `position` prop.
- Each tab button has `role="tab"`, `aria-selected` (`"true"` or `"false"`), and `aria-controls` pointing to its associated panel id.
- Disabled tabs receive `aria-disabled="true"`.
- The active tab has `tabIndex="0"`; all other tabs have `tabIndex="-1"`, implementing the roving tabindex pattern.
- The tab panel has `role="tabpanel"`, `aria-labelledby` pointing to its tab button, and `tabIndex="0"` so it is focusable.
- **Keyboard shortcuts:**
  - **ArrowLeft / ArrowRight** (horizontal position): Move focus to the previous/next enabled tab.
  - **ArrowUp / ArrowDown** (vertical position): Move focus to the previous/next enabled tab.
  - **Home**: Move focus to the first enabled tab.
  - **End**: Move focus to the last enabled tab.
  - Arrow keys wrap around from first to last and vice versa.
