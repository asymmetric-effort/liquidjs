# MultilineField

Multi-line textarea input with integrated FormFieldWrapper. Supports auto-resize, character counting, and configurable row height.

## Import

```ts
import { MultilineField } from '@aspect/form/multiline';
import type { MultilineFieldProps } from '@aspect/form/multiline';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `undefined` | Current value (controlled mode) |
| `defaultValue` | `string` | `undefined` | Default value (uncontrolled mode) |
| `onChange` | `(value: string) => void` | `undefined` | Change handler |
| `onBlur` | `(value: string) => void` | `undefined` | Blur handler |
| `placeholder` | `string` | `undefined` | Placeholder text |
| `name` | `string` | `undefined` | HTML name attribute |
| `id` | `string` | auto-generated | HTML id |
| `rows` | `number` | `4` | Number of visible text rows |
| `maxLength` | `number` | `undefined` | Maximum character length |
| `autoResize` | `boolean` | `false` | Auto-resize the textarea to fit content |
| `minHeight` | `string` | `undefined` | Minimum height when auto-resizing |
| `maxHeight` | `string` | `undefined` | Maximum height when auto-resizing |
| `readOnly` | `boolean` | `undefined` | Read-only state |
| `disabled` | `boolean` | `undefined` | Disabled state |
| `showCount` | `boolean` | `false` | Show character count below the textarea |
| `label` | `string` | `undefined` | Label text |
| `helpText` | `string` | `undefined` | Help text below the field |
| `error` | `string` | `undefined` | Error message. Activates error styling |
| `required` | `boolean` | `undefined` | Shows required asterisk |
| `wrapperStyle` | `FormFieldWrapperStyle` | `undefined` | Styling for the FormFieldWrapper |
| `inputStyle` | `InputBaseStyle` | `undefined` | Styling for the textarea element |
| `className` | `string` | `undefined` | Extra CSS class on the textarea |

## Usage

```ts
import { createElement } from 'liquidjs';
import { MultilineField } from '@aspect/form/multiline';

// Basic textarea
const bio = createElement(MultilineField, {
  label: 'Bio',
  placeholder: 'Tell us about yourself...',
  rows: 5,
  value: bio,
  onChange: (val) => setBio(val),
});

// With character count and max length
const comment = createElement(MultilineField, {
  label: 'Comment',
  maxLength: 500,
  showCount: true,
  value: comment,
  onChange: (val) => setComment(val),
});

// Auto-resizing textarea
const notes = createElement(MultilineField, {
  label: 'Notes',
  autoResize: true,
  minHeight: '100px',
  maxHeight: '400px',
  value: notes,
  onChange: (val) => setNotes(val),
});
```

## Features

- Wraps a native `<textarea>` element inside a FormFieldWrapper.
- Configurable visible rows with the `rows` prop (default: 4).
- Auto-resize mode dynamically adjusts height to fit content, with optional min/max height constraints. Disables manual vertical resize when active.
- Character counter displayed below the textarea when `showCount` is enabled. Shows "N/maxLength" when `maxLength` is set, or "N characters" otherwise.
- Counter text turns red when the character count exceeds 90% of the maximum length.
- Focus state tracking with border color and box-shadow transitions.
- Line height set to 1.5 for comfortable multi-line reading.

## Accessibility

- The label is linked to the textarea via `htmlFor`/`id` association.
- `aria-invalid="true"` is set when an error message is present.
- `aria-required="true"` is set when the field is marked as required.
- The textarea is natively focusable and supports standard keyboard interaction.
- Error messages in the wrapper use `role="alert"`.
