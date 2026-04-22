# TextField

Single-line text input with integrated FormFieldWrapper for label, help text, and error display. Supports prefix/suffix addons, multiple input types, and controlled/uncontrolled usage.

## Import

```ts
import { TextField } from '@aspect/form/textfield';
import type { TextFieldProps } from '@aspect/form/textfield';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `undefined` | Current value (controlled mode) |
| `defaultValue` | `string` | `undefined` | Default value (uncontrolled mode) |
| `onChange` | `(value: string) => void` | `undefined` | Change handler fired on every input event |
| `onInput` | `(value: string) => void` | `undefined` | Input event handler (fires on every keystroke) |
| `onBlur` | `(value: string) => void` | `undefined` | Blur handler |
| `onEnter` | `(value: string) => void` | `undefined` | Enter key handler |
| `placeholder` | `string` | `undefined` | Placeholder text |
| `type` | `'text' \| 'password' \| 'email' \| 'url' \| 'tel' \| 'search' \| 'number'` | `'text'` | HTML input type |
| `name` | `string` | `undefined` | HTML name attribute |
| `id` | `string` | auto-generated | HTML id |
| `maxLength` | `number` | `undefined` | Maximum character length |
| `pattern` | `string` | `undefined` | Validation pattern |
| `autoComplete` | `string` | `undefined` | Auto-complete hint |
| `autoFocus` | `boolean` | `undefined` | Autofocus on mount |
| `readOnly` | `boolean` | `undefined` | Read-only state |
| `disabled` | `boolean` | `undefined` | Disabled state |
| `prefix` | `unknown` | `undefined` | Prefix element (icon, text) rendered before the input |
| `suffix` | `unknown` | `undefined` | Suffix element (icon, button) rendered after the input |
| `label` | `string` | `undefined` | Label text |
| `helpText` | `string` | `undefined` | Help text below the field |
| `error` | `string` | `undefined` | Error message. Activates error styling |
| `required` | `boolean` | `undefined` | Shows required asterisk |
| `wrapperStyle` | `FormFieldWrapperStyle` | `undefined` | Styling for the FormFieldWrapper |
| `inputStyle` | `InputBaseStyle` | `undefined` | Styling for the input element |
| `className` | `string` | `undefined` | Extra CSS class on the input |

## Usage

```ts
import { createElement } from 'liquidjs';
import { TextField } from '@aspect/form/textfield';

// Basic text field
const basic = createElement(TextField, {
  label: 'Name',
  placeholder: 'Enter your name',
  value: name,
  onChange: (val) => setName(val),
});

// Email field with validation error
const email = createElement(TextField, {
  label: 'Email',
  type: 'email',
  placeholder: 'you@example.com',
  value: email,
  onChange: (val) => setEmail(val),
  error: !isValidEmail ? 'Invalid email address' : undefined,
  required: true,
});

// With prefix and suffix
const price = createElement(TextField, {
  label: 'Price',
  type: 'number',
  prefix: '$',
  suffix: 'USD',
  value: price,
  onChange: (val) => setPrice(val),
});

// With Enter key handler
const search = createElement(TextField, {
  type: 'search',
  placeholder: 'Search...',
  onEnter: (val) => performSearch(val),
});
```

## Features

- Wraps a native `<input>` element inside a FormFieldWrapper for consistent label, help text, and error display.
- Supports seven input types: text, password, email, url, tel, search, and number.
- Prefix and suffix addon slots with automatic flex layout when either is provided.
- Focus state tracking with border color and box-shadow transitions via `buildInputStyle`.
- Enter key handler (`onEnter`) for search and submit use cases.
- Auto-generated unique `id` when none is provided, ensuring label-input association.
- Controlled and uncontrolled usage patterns.

## Accessibility

- The label is linked to the input via `htmlFor`/`id` association.
- `aria-invalid="true"` is set when an error message is present.
- `aria-required="true"` is set when the field is marked as required.
- The input is natively focusable and supports keyboard interaction.
- Error messages in the wrapper use `role="alert"` for screen reader announcements.
