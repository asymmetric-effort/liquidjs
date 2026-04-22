# Accordion

Expandable/collapsible section navigation component. Provides accessible accordion behavior with configurable single or multiple expansion, animation, keyboard navigation, and custom styling. Built on NavWrapper.

## Import

```ts
import { Accordion } from '@liquidjs/components/nav/accordion';
import type {
  AccordionProps,
  AccordionSection,
  AccordionHeaderStyle,
  AccordionContentStyle,
} from '@liquidjs/components/nav/accordion';
```

## Props

### AccordionProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sections` | `AccordionSection[]` | *required* | Array of sections to render. |
| `defaultExpanded` | `string[]` | `[]` | IDs of sections expanded on initial render. |
| `allowMultiple` | `boolean` | `false` | Allow multiple sections to be open simultaneously. |
| `headerStyle` | `AccordionHeaderStyle` | `{}` | Styling for section headers. |
| `contentStyle` | `AccordionContentStyle` | `{}` | Styling for section content panels. |
| `wrapperStyle` | `NavWrapperStyle` | `undefined` | Styling passed through to the NavWrapper container. |
| `expandIcon` | `string` | `'+'` | Icon shown on collapsed sections. |
| `collapseIcon` | `string` | `'\u2212'` (minus) | Icon shown on expanded sections. |
| `iconPosition` | `'left' \| 'right'` | `'right'` | Position of the expand/collapse icon. |
| `animated` | `boolean` | `true` | Enable smooth open/close animation via max-height transition. |
| `onChange` | `(expandedIds: string[]) => void` | `undefined` | Callback fired with the array of currently expanded section IDs. |

### AccordionSection

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | `string` | *required* | Unique identifier for the section. |
| `header` | `string` | *required* | Text displayed in the section header. |
| `content` | `unknown` | *required* | Content rendered when the section is expanded. |
| `icon` | `string` | `undefined` | Optional icon displayed in the header. |
| `disabled` | `boolean` | `false` | When true, the section cannot be toggled. |

### AccordionHeaderStyle

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `padding` | `string` | `'12px 16px'` | Header padding. |
| `backgroundColor` | `string` | `'transparent'` | Header background color. |
| `hoverBackground` | `string` | `'#f3f4f6'` | Background on hover. |
| `color` | `string` | `'inherit'` | Header text color. |
| `fontWeight` | `string` | `'600'` | Header font weight. |
| `fontSize` | `string` | `'inherit'` | Header font size. |
| `borderBottom` | `string` | `undefined` | Border between header and content. |

### AccordionContentStyle

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `padding` | `string` | `'12px 16px'` | Content padding. |
| `backgroundColor` | `string` | `'transparent'` | Content background color. |
| `borderBottom` | `string` | `undefined` | Border at the bottom of the content panel. |

## Usage

```ts
import { createElement } from '@liquidjs/core';
import { Accordion } from '@liquidjs/components/nav/accordion';

const accordion = createElement(Accordion, {
  sections: [
    { id: 'general', header: 'General Settings', content: 'General content here...' },
    { id: 'privacy', header: 'Privacy', icon: 'L', content: 'Privacy content here...' },
    { id: 'advanced', header: 'Advanced', content: 'Advanced content here...', disabled: true },
  ],
  defaultExpanded: ['general'],
  allowMultiple: false,
  iconPosition: 'right',
  onChange: (ids) => console.log('Expanded sections:', ids),
});
```

## Features

- **Single or multiple expansion** -- toggle between exclusive (only one open at a time) and independent section expansion.
- **Animated transitions** -- smooth open/close via max-height CSS transition (can be disabled).
- **Configurable icons** -- customize expand/collapse icons and their position (left or right).
- **Section icons** -- each section header can display an optional icon.
- **Disabled sections** -- individual sections can be locked from toggling, with visual feedback (grayed out, cursor not-allowed).
- **Default expanded** -- specify which sections start in the expanded state.
- **Change callback** -- `onChange` reports the current set of expanded section IDs after every toggle.

## Accessibility

- The outer wrapper uses `role="region"` with `aria-label="Accordion"`.
- Each section header is a `<button>` element with `aria-expanded` reflecting its state.
- Disabled sections are marked with `aria-disabled="true"` and removed from the tab order (`tabIndex: -1`).
- Content panels use `role="region"` with `aria-hidden` toggled based on expansion state.
- Headers respond to Enter and Space key presses for toggling.
- Arrow-key keyboard navigation between section headers is provided by the NavWrapper.
- Expand/collapse icons are hidden from assistive technology with `aria-hidden="true"`.
