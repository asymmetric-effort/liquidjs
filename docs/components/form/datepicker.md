# DatePicker

Calendar dropdown date picker. Features month/year navigation, a day grid, today highlight, selected date highlight, and min/max date constraints.

## Import

```ts
import { DatePicker } from '@aspect/form/datepicker';
import type { DatePickerProps } from '@aspect/form/datepicker';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date \| string \| null` | required | Current value as a Date object or `'YYYY-MM-DD'` string |
| `onChange` | `(value: string) => void` | required | Change handler. Receives an ISO date string (`YYYY-MM-DD`) |
| `format` | `string` | `'YYYY-MM-DD'` | Display format for the trigger text. Supports `YYYY`, `MM`, `DD` tokens |
| `minDate` | `Date \| string` | `undefined` | Earliest selectable date |
| `maxDate` | `Date \| string` | `undefined` | Latest selectable date |
| `disabled` | `boolean` | `false` | Disabled state |
| `placeholder` | `string` | `'Select date...'` | Placeholder text when no date is selected |
| `label` | `string` | `undefined` | Label text |
| `error` | `string` | `undefined` | Error message |

## Usage

```ts
import { createElement } from 'specifyjs';
import { DatePicker } from '@aspect/form/datepicker';

// Basic date picker
const basic = createElement(DatePicker, {
  label: 'Start Date',
  value: startDate,
  onChange: (val) => setStartDate(val),
});

// With min/max constraints
const constrained = createElement(DatePicker, {
  label: 'Appointment',
  value: appointment,
  onChange: (val) => setAppointment(val),
  minDate: '2024-01-01',
  maxDate: '2024-12-31',
  format: 'MM/DD/YYYY',
});

// With error
const withError = createElement(DatePicker, {
  label: 'Due Date',
  value: null,
  onChange: (val) => setDueDate(val),
  error: 'A due date is required',
});
```

## Features

- Dropdown calendar panel (280px wide) opens below the trigger on click.
- Month/year navigation with left and right arrow buttons in the calendar header.
- 7-column day grid with abbreviated day names (Su, Mo, Tu, We, Th, Fr, Sa).
- Today is highlighted with a bold font weight and blue border.
- Selected date is highlighted with a blue background and white text.
- Dates outside the min/max range are grayed out and cannot be selected.
- Configurable display format using `YYYY`, `MM`, and `DD` tokens.
- Calendar icon displayed in the trigger alongside the formatted date or placeholder.
- Outside click detection closes the dropdown automatically.
- The view month/year initializes to the selected date, or the current date if no selection.

## Accessibility

- The trigger uses `role="button"` with `aria-label="Pick a date"`.
- The trigger is keyboard-focusable via `tabIndex`.
- Out-of-range dates use `cursor: not-allowed` as a visual indicator.
- The component is wrapped in a FormFieldWrapper for label and error display, with error messages using `role="alert"`.
