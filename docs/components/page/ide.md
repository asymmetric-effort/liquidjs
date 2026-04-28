# IDE

Full-screen layout resembling a programmer's IDE (VS Code style). Features a title bar, menu bar, left sidebar file explorer, main editor area with line numbers and syntax-highlighted TypeScript, a right minimap strip, a bottom terminal panel, and a status bar.

## Import

```ts
import { IDE } from 'specifyjs/components/page/ide';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | -- | Extra class name |

## Usage

```ts
import { createElement } from 'specifyjs/core';
import { IDE } from 'specifyjs/components/page/ide';

const ide = createElement(IDE, { className: 'my-ide' });
```

## Features

- **Title bar** displaying "SpecifyJS IDE".
- **Menu bar** with File, Edit, Selection, View, Go, Run, Terminal, and Help items.
- **File explorer sidebar** (220px) with a nested file tree showing folders and files with indentation and icons.
- **Editor area** with a tab bar (active tab: App.ts), line numbers, and syntax-colored TypeScript sample code. Colors differentiate imports, keywords, functions, and comments.
- **Minimap** strip on the right edge representing code density as thin colored bars.
- **Bottom terminal panel** (120px) with Terminal, Problems, and Output tabs. The Terminal tab displays sample `npm run dev` output.
- **Status bar** (blue, VS Code style) showing branch name, error/warning counts, cursor position, encoding, and language.

## Accessibility

- The menu bar renders with `role="menubar"` and each item has `role="menuitem"` with an `aria-label`.
- The file explorer sidebar is a `<nav>` with `aria-label="File explorer"`.
- Line numbers and the minimap are marked `aria-hidden="true"` as decorative elements.
- The bottom panel tab bar uses `role="tablist"` with `role="tab"` and `aria-selected` on each tab.
- The terminal content area has `role="log"` for assistive technology.
