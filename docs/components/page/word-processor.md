# WordProcessor

Full-screen layout resembling a word processor application. Features a menu bar, formatting toolbar, ruler bar, centered document page on a gray background, and a status bar with page/word count and zoom.

## Import

```ts
import { WordProcessor } from 'specifyjs/components/page/word-processor';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string` | `'Start typing...'` | Document content rendered in the page area |
| `className` | `string` | -- | Extra class name |

## Usage

```ts
import { createElement } from 'specifyjs/core';
import { WordProcessor } from 'specifyjs/components/page/word-processor';

const doc = createElement(
  WordProcessor,
  { content: 'Hello, world! This is my document.' },
);
```

## Features

- **Menu bar** with File, Edit, View, Insert, Format, Tools, and Help menu buttons.
- **Formatting toolbar** with grouped controls for Bold, Italic, Underline, font size, and text alignment.
- **Ruler bar** with major/minor tick marks and numeric labels, marked as decorative (`aria-hidden`).
- **Document page** centered on a gray canvas (680px wide, serif font, letter-style padding).
- **Status bar** showing page count, live word count computed from `content`, and zoom percentage.
- **Word count** is automatically calculated from the `content` prop.

## Accessibility

- The menu bar renders with `role="menubar"` and each menu item has `role="menuitem"` with an `aria-label`.
- The formatting toolbar uses `role="toolbar"` with `aria-label="Formatting toolbar"`. Each button has a `title` and `aria-label`.
- The ruler is marked `aria-hidden="true"` since it is decorative.
- The document area uses a `<main>` element for landmark navigation.
- No keyboard shortcuts are bound by the component itself.
