# TimePicker

Time selection component with hour and minute spinners. Supports both 12-hour (AM/PM) and 24-hour formats with configurable minute step increments.

## Import

```ts
import { TimePicker } from '@aspect/form/timepicker';
import type { TimePickerProps } from '@aspect/form/timepicker';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | required | Current value in `'HH:MM'` format (24-hour) |
| `onChange` | `(value: string) => void` | required | Change handler. Receives `'HH:MM'` string in 24-hour format |
| `format` | `'12h' \| '24h'` | `'24h'` | Display format |
| `minuteStep` | `number` | `1` | Minute increment step for the up/down buttons |
| `disabled` | `boolean` | `false` | Disabled state |
| `label` | `string` | `undefined` | Label text |
| `error` | `string` | `undefined` | Error message |

## Usage

```ts
import { createElement } from 'liquidjs';
import { TimePicker } from '@aspect/form/timepicker';

// 24-hour time picker
const time24 = createElement(TimePicker, {
  label: 'Meeting Time',
  value: '14:30',
  onChange: (val) => setTime(val),
});

// 12-hour format with 15-minute steps
const time12 = createElement(TimePicker, {
  label: 'Alarm',
  value: '08:00',
  onChange: (val) => setAlarm(val),
  format: '12h',
  minuteStep: 15,
});

// Disabled
const disabled = createElement(TimePicker, {
  label: 'Locked Time',
  value: '09:00',
  onChange: () => {},
  disabled: true,
});
```

## Features

- Dual spinner layout with hour and minute fields separated by a colon.
- Each spinner has up/down arrow buttons for incrementing and decrementing values.
- Direct text input in the hour and minute fields for manual entry.
- 12-hour format mode displays an AM/PM toggle button alongside the spinners.
- AM/PM toggle shifts the hour by 12 internally while the `onChange` handler always receives 24-hour format.
- Hours are clamped to the 0-23 range; minutes are clamped to 0-59.
- Values are zero-padded to two digits in both the display and the output.
- Configurable minute step for the increment/decrement buttons (e.g., step by 5 or 15).
- Focus state tracking with border color and box-shadow transitions on the container.
- Monospace font for the time inputs for consistent digit alignment.

## Accessibility

- Hour and minute inputs have `aria-label` attributes ("Hour" and "Minute" respectively).
- The AM/PM toggle button has `aria-label="Toggle AM/PM"`.
- Up/down arrow buttons are standard `<button>` elements with clear visual indicators.
- Inputs are disabled when the component is in disabled state.
- The component is wrapped in a FormFieldWrapper for label and error display.
