# Panel

Collapsible panel with a header bar, optional icon, and animated expand/collapse transition.

## Import

```ts
import { Panel } from 'specifyjs/components/layout/panel';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | -- | Panel title |
| `collapsible` | `boolean` | `false` | Whether the panel can be collapsed |
| `defaultCollapsed` | `boolean` | `false` | Initial collapsed state when collapsible |
| `icon` | `unknown` | -- | Icon element rendered before the title |
| `headerRight` | `unknown` | -- | Slot rendered at the trailing edge of the header |
| `bordered` | `boolean` | `true` | Show border |
| `shadow` | `'none' \| 'sm' \| 'md'` | `'none'` | Shadow level |
| `style` | `Record<string, string>` | -- | Extra inline styles |
| `className` | `string` | -- | Extra class name |
| `children` | `unknown` | -- | Body content |

## Usage

```ts
import { createElement } from 'specifyjs/core';
import { Panel } from 'specifyjs/components/layout/panel';

const panel = createElement(
  Panel,
  { title: 'Details', collapsible: true },
  'Panel body content goes here.',
);
```

## Variants / Features

### Static panel (non-collapsible)

A simple panel with a header bar and body.

```ts
createElement(Panel, { title: 'Information' }, 'Static content');
```

### Collapsible panel

Click the header to toggle the body. An animated chevron indicates the current state.

```ts
createElement(
  Panel,
  { title: 'Advanced Options', collapsible: true, defaultCollapsed: true },
  'Hidden by default, click header to expand.',
);
```

### Panel with icon

```ts
createElement(
  Panel,
  { title: 'Notifications', icon: createElement('span', null, 'icon') },
  'Notification list...',
);
```

### Header right slot

Place actions or badges in the trailing header area.

```ts
createElement(
  Panel,
  {
    title: 'Tasks',
    headerRight: createElement('span', null, '3 remaining'),
  },
  'Task list...',
);
```

### Shadow variants

```ts
createElement(Panel, { title: 'Elevated', shadow: 'md' }, 'Content with medium shadow');
```

### Borderless

```ts
createElement(Panel, { title: 'Clean', bordered: false }, 'No border panel');
```

## Accessibility

- When `collapsible` is `true`, the header element receives `role="button"` and `aria-expanded` set to `"true"` or `"false"` reflecting the current state.
- The header is clickable to toggle collapse. Users can activate it by clicking.
- The collapse animation uses `max-height` transition for a smooth expand/collapse effect.
- When `collapsible` is `false`, no interactive ARIA attributes are added to the header.
- No additional keyboard shortcuts are added beyond standard button activation (Enter/Space when focused).
