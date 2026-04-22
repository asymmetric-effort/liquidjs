# FormFieldWrapper

Base container for all form components. Provides consistent label rendering, help text, error display, required indicator, and styling. Used as the foundation for TextField, MultilineField, TextEditor, and other form controls.

## Import

```ts
import { FormFieldWrapper, buildInputStyle } from '@aspect/form/wrapper';
import type { FormFieldWrapperProps, FormFieldWrapperStyle, InputBaseStyle } from '@aspect/form/wrapper';
```

## Props

### FormFieldWrapperProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `undefined` | Label text displayed above the field |
| `htmlFor` | `string` | `undefined` | HTML `id` to link the label to an input via `htmlFor` |
| `helpText` | `string` | `undefined` | Help or description text shown below the field |
| `error` | `string` | `undefined` | Error message. When set, the field enters an error state |
| `required` | `boolean` | `false` | Shows a required asterisk next to the label |
| `disabled` | `boolean` | `false` | Disabled state. Reduces container opacity to 0.6 |
| `styling` | `FormFieldWrapperStyle` | `undefined` | Style overrides for the wrapper |
| `className` | `string` | `undefined` | Extra CSS class appended to the container |
| `children` | `unknown` | `undefined` | The form control to render inside the wrapper |

### FormFieldWrapperStyle

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fontFamily` | `string` | `'inherit'` | Container font family |
| `fontSize` | `string` | `'14px'` | Container font size |
| `labelColor` | `string` | `'#374151'` | Label text color |
| `labelFontWeight` | `string` | `'500'` | Label font weight |
| `labelFontSize` | `string` | `'14px'` | Label font size |
| `helpColor` | `string` | `'#6b7280'` | Help text color |
| `errorColor` | `string` | `'#ef4444'` | Error text color |
| `errorBorderColor` | `string` | `'#ef4444'` | Error border color applied to the child |
| `focusBorderColor` | `string` | `'#3b82f6'` | Focus border color hint |
| `gap` | `string` | `'4px'` | Gap between label, field, and help text |
| `width` | `string \| number` | `'100%'` | Container width. Numbers are treated as pixels |
| `custom` | `Record<string, string>` | `undefined` | Custom CSS overrides merged into the container style |

### InputBaseStyle

Shared input styling interface used by `buildInputStyle` for TextField, MultilineField, and TextEditor.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `padding` | `string` | `'8px 12px'` | Input padding |
| `border` | `string` | `'1px solid #d1d5db'` | Default border |
| `borderRadius` | `string` | `'6px'` | Border radius |
| `fontSize` | `string` | `'14px'` | Font size |
| `fontFamily` | `string` | `'inherit'` | Font family |
| `backgroundColor` | `string` | `'#ffffff'` | Background color |
| `color` | `string` | `'#1f2937'` | Text color |
| `focusBorderColor` | `string` | `'#3b82f6'` | Border color when focused |
| `errorBorderColor` | `string` | `'#ef4444'` | Border color in error state |
| `transition` | `string` | `'border-color 0.15s'` | CSS transition |
| `custom` | `Record<string, string>` | `undefined` | Custom CSS overrides |

## Usage

```ts
import { createElement } from 'liquidjs';
import { FormFieldWrapper } from '@aspect/form/wrapper';

const element = createElement(
  FormFieldWrapper,
  {
    label: 'Username',
    htmlFor: 'username-input',
    helpText: 'Enter your preferred username',
    required: true,
  },
  createElement('input', { id: 'username-input', type: 'text' })
);
```

```ts
// With error state
const errorField = createElement(
  FormFieldWrapper,
  {
    label: 'Email',
    error: 'Please enter a valid email address',
    required: true,
  },
  createElement('input', { type: 'email' })
);
```

```ts
// Using buildInputStyle for custom inputs
import { buildInputStyle } from '@aspect/form/wrapper';

const style = buildInputStyle(
  { borderRadius: '8px', focusBorderColor: '#10b981' },
  { focused: true, error: false }
);
```

## Features

- Flexbox column layout with configurable gap between label, field, and help/error text.
- Conditional label rendering with optional required asterisk indicator.
- Error state automatically switches help text to error message with `role="alert"`.
- Disabled state reduces opacity to 0.6 for visual feedback.
- `buildInputStyle` utility generates consistent input styles with focus ring (box-shadow) and error border handling for use across multiple form components.
- CSS class `form-field--error` is applied when an error is present for external styling hooks.
- Fully customizable via the `styling` prop and `custom` overrides.

## Accessibility

- The `label` element uses `htmlFor` to associate with the input control.
- Required fields display a visual asterisk indicator.
- Error messages are rendered with `role="alert"` so screen readers announce them immediately.
- The `disabled` state applies reduced opacity as a visual cue.
