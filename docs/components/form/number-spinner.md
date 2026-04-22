# NumberSpinner

Numeric input with increment and decrement buttons. Features +/- buttons on either side of the input, keyboard arrow support, optional prefix/suffix, and min/max value clamping.

## Import

```ts
import { NumberSpinner } from '@aspect/form/number-spinner';
import type { NumberSpinnerProps } from '@aspect/form/number-spinner';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | required | Current numeric value |
| `onChange` | `(value: number) => void` | required | Change handler |
| `min` | `number` | `undefined` | Minimum allowed value |
| `max` | `number` | `undefined` | Maximum allowed value |
| `step` | `number` | `1` | Step increment for the buttons and keyboard arrows |
| `disabled` | `boolean` | `false` | Disabled state |
| `prefix` | `string` | `undefined` | Prefix text displayed before the input (e.g., `'$'`) |
| `suffix` | `string` | `undefined` | Suffix text displayed after the input (e.g., `'kg'`) |
| `label` | `string` | `undefined` | Label text |
| `error` | `string` | `undefined` | Error message |

## Usage

```ts
import { createElement } from 'liquidjs';
import { NumberSpinner } from '@aspect/form/number-spinner';

// Basic number spinner
const basic = createElement(NumberSpinner, {
  label: 'Quantity',
  value: quantity,
  onChange: (val) => setQuantity(val),
  min: 0,
  max: 99,
});

// With prefix and suffix
const weight = createElement(NumberSpinner, {
  label: 'Weight',
  value: weight,
  onChange: (val) => setWeight(val),
  min: 0,
  step: 0.5,
  suffix: 'kg',
});

// Currency input
const price = createElement(NumberSpinner, {
  label: 'Price',
  value: price,
  onChange: (val) => setPrice(val),
  min: 0,
  step: 0.01,
  prefix: '$',
});
```

## Features

- Decrement (-) button on the left and increment (+) button on the right, flanking the text input.
- Buttons automatically disable when the value reaches the min or max boundary. Disabled buttons show grayed-out text and `not-allowed` cursor.
- Direct text input for manual numeric entry with `parseFloat` parsing and min/max clamping.
- Keyboard support: ArrowUp increments, ArrowDown decrements by the step value.
- Optional prefix and suffix text displayed in styled affix areas between the buttons and the input.
- Focus state shows a blue border with a subtle box-shadow ring on the container.
- Error state changes the container border to red.
- Values are clamped to the min/max range on every change (button click, keyboard, or text input).
- The input field is center-aligned with a minimum width of 48px.
- Disabled state reduces opacity to 0.6 and disables all interactive elements.

## Accessibility

- The input uses `role="spinbutton"` to identify the component as a numeric spinner.
- `aria-valuenow` reflects the current value.
- `aria-valuemin` and `aria-valuemax` are set when min/max props are provided.
- `aria-label` is set to the label text, or falls back to "Number".
- Decrement and increment buttons have `aria-label` values of "Decrement" and "Increment" respectively.
- Buttons have `tabIndex: -1` to keep them out of the tab order, directing keyboard focus to the input.
- The component is wrapped in a FormFieldWrapper for label and error display.
