# UnityDesktop

Full-screen layout resembling the Ubuntu Unity Desktop. Features a left sidebar launcher bar with icon buttons, a top panel bar with Activities, clock, and system tray, and a main desktop area with an aubergine gradient background.

## Import

```ts
import { UnityDesktop } from 'specifyjs/components/page/unity-desktop';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `unknown` | -- | Content rendered in the main desktop area |
| `className` | `string` | -- | Extra class name |

## Usage

```ts
import { createElement } from 'specifyjs/core';
import { UnityDesktop } from 'specifyjs/components/page/unity-desktop';

const desktop = createElement(
  UnityDesktop,
  { className: 'my-desktop' },
  createElement('div', null, 'Desktop content here'),
);
```

## Features

- **Top panel** with Activities button, centered date/clock display, and system tray icons (volume, network, battery).
- **Launcher sidebar** with 8 preset application icons (Files, Browser, Terminal, Mail, Music, Photos, Software, Settings) rendered as accessible buttons.
- **Show Applications** grid button pinned to the bottom of the launcher.
- **Aubergine gradient** desktop background matching the classic Unity color scheme.
- **48px launcher** and **28px top panel** with fixed dimensions and responsive flex layout.

## Accessibility

- The launcher sidebar renders as a `<nav>` element with `aria-label="Application launcher"`.
- Each launcher icon is a `<button>` with a `title` and `aria-label` set to the application name.
- The main desktop area uses a `<main>` element for landmark navigation.
- The top panel tray icons have `cursor: pointer` but no ARIA roles; wrap them in buttons or add `role="button"` and keyboard handlers for full interactivity.
