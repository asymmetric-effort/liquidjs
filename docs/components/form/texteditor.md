# TextEditor

Simple WYSIWYG rich text editor using `contentEditable`. Provides a toolbar with basic formatting commands (bold, italic, underline, lists, headings, links) and a contentEditable editing area. Zero dependencies -- uses `document.execCommand` for formatting.

## Import

```ts
import { TextEditor } from '@aspect/form/texteditor';
import type { TextEditorProps, ToolbarButton } from '@aspect/form/texteditor';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `undefined` | Initial HTML content |
| `onChange` | `(html: string) => void` | `undefined` | Change handler. Receives the HTML string |
| `onBlur` | `(html: string) => void` | `undefined` | Blur handler |
| `placeholder` | `string` | `''` | Placeholder text (via `data-placeholder` attribute) |
| `minHeight` | `string` | `'200px'` | Minimum height of the editing area |
| `maxHeight` | `string` | `'none'` | Maximum height (grows to fit by default) |
| `readOnly` | `boolean` | `undefined` | Read-only mode. Disables toolbar and editing |
| `disabled` | `boolean` | `undefined` | Disabled state. Sets `contentEditable` to false |
| `toolbar` | `ToolbarButton[]` | all buttons | Which toolbar buttons to display |
| `id` | `string` | auto-generated | HTML id for the editor area |
| `toolbarStyle` | `object` | `undefined` | Toolbar styling overrides (see below) |
| `editorStyle` | `object` | `undefined` | Editor area styling overrides (see below) |
| `label` | `string` | `undefined` | Label text |
| `helpText` | `string` | `undefined` | Help text below the editor |
| `error` | `string` | `undefined` | Error message. Activates error styling |
| `required` | `boolean` | `undefined` | Shows required asterisk |
| `wrapperStyle` | `FormFieldWrapperStyle` | `undefined` | Styling for the FormFieldWrapper |

### ToolbarButton

Available toolbar button identifiers:

`'bold'` | `'italic'` | `'underline'` | `'strikethrough'` | `'heading1'` | `'heading2'` | `'heading3'` | `'bulletList'` | `'orderedList'` | `'blockquote'` | `'link'` | `'unlink'` | `'insertHR'` | `'removeFormat'` | `'undo'` | `'redo'`

### toolbarStyle

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `backgroundColor` | `string` | `'#f9fafb'` | Toolbar background color |
| `borderBottom` | `string` | `'1px solid #e5e7eb'` | Bottom border of toolbar |
| `buttonColor` | `string` | `'#374151'` | Toolbar button text color |
| `buttonHoverBackground` | `string` | `undefined` | Button hover background |
| `buttonActiveBackground` | `string` | `undefined` | Button active background |
| `buttonSize` | `string` | `'13px'` | Toolbar button font size |

### editorStyle

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `padding` | `string` | `'12px 14px'` | Editor area padding |
| `backgroundColor` | `string` | `'#ffffff'` | Editor background |
| `color` | `string` | `'#1f2937'` | Editor text color |
| `fontFamily` | `string` | `'inherit'` | Editor font family |
| `fontSize` | `string` | `'14px'` | Editor font size |
| `lineHeight` | `string` | `'1.6'` | Editor line height |

## Usage

```ts
import { createElement } from 'liquidjs';
import { TextEditor } from '@aspect/form/texteditor';

// Basic rich text editor
const editor = createElement(TextEditor, {
  label: 'Description',
  value: '<p>Initial content</p>',
  onChange: (html) => setContent(html),
  placeholder: 'Start writing...',
});

// With limited toolbar
const simpleEditor = createElement(TextEditor, {
  label: 'Comment',
  toolbar: ['bold', 'italic', 'bulletList', 'link'],
  minHeight: '120px',
  maxHeight: '300px',
  onChange: (html) => setComment(html),
});

// Read-only display
const readOnly = createElement(TextEditor, {
  label: 'Preview',
  value: savedHtml,
  readOnly: true,
});
```

## Features

- Configurable toolbar with 16 formatting commands including bold, italic, underline, strikethrough, headings (H1-H3), bullet and ordered lists, blockquote, link/unlink, horizontal rule, clear formatting, undo, and redo.
- Link insertion prompts the user for a URL via `prompt()`.
- Toolbar and editor area are rendered inside a unified bordered container with rounded corners.
- Focus state changes the container border color to blue; error state uses red.
- Initial content is set via `innerHTML` on mount when the `value` prop is provided.
- Customizable toolbar and editor area styling via separate style prop objects.
- Scrollable editing area with configurable min/max height.

## Accessibility

- The editing area uses `role="textbox"` and `aria-multiline="true"` for screen reader identification.
- `aria-label` is set to the label prop value, or falls back to "Text editor".
- The `data-placeholder` attribute provides placeholder text guidance.
- Toolbar buttons have descriptive `title` attributes for tooltip display.
- Toolbar buttons are disabled in read-only and disabled states, with `cursor: not-allowed`.
- `contentEditable` is set to `'false'` when the component is disabled.
