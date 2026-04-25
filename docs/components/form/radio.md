# RadioGroup

Radio button group component. Wraps individual radio buttons with support for horizontal and vertical layout, keyboard navigation, and error states.

## Import

```ts
import { RadioGroup } from '@aspect/form/radio';
import type { RadioGroupProps, RadioOption } from '@aspect/form/radio';
```

## Props

### RadioGroupProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `RadioOption[]` | required | Available options |
| `value` | `string` | required | Currently selected value |
| `onChange` | `(value: string) => void` | required | Change handler |
| `name` | `string` | required | HTML name attribute for the radio group |
| `direction` | `'horizontal' \| 'vertical'` | `'vertical'` | Layout direction |
| `disabled` | `boolean` | `false` | Disabled state for the entire group |
| `error` | `string` | `undefined` | Error message |
| `label` | `string` | `undefined` | Label for the group |

### RadioOption

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | required | Option value |
| `label` | `string` | required | Display label |
| `disabled` | `boolean` | `undefined` | Whether this individual option is disabled |

## Usage

```ts
import { createElement } from 'specifyjs';
import { RadioGroup } from '@aspect/form/radio';

// Vertical radio group
const vertical = createElement(RadioGroup, {
  label: 'Plan',
  name: 'plan',
  options: [
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' },
    { value: 'enterprise', label: 'Enterprise' },
  ],
  value: plan,
  onChange: (val) => setPlan(val),
});

// Horizontal layout with disabled option
const horizontal = createElement(RadioGroup, {
  label: 'Priority',
  name: 'priority',
  direction: 'horizontal',
  options: [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical', disabled: true },
  ],
  value: priority,
  onChange: (val) => setPriority(val),
});
```

## Features

- Horizontal and vertical layout options. Horizontal uses 16px gap, vertical uses 8px gap.
- Custom styled radio buttons with an outer circle (18px) and animated inner dot (8px) that scales in/out on selection.
- Individual options can be independently disabled while the rest remain interactive.
- Hidden native `<input type="radio">` elements for form compatibility.
- Error state changes the outer circle border to red for all options.
- Arrow key navigation wraps around at the boundaries of enabled options.
- Smooth CSS transitions on border color and inner dot scale.

## Accessibility

- The group container uses `role="radiogroup"` with `aria-label` set to the label text.
- The group is keyboard-focusable via `tabIndex`.
- Arrow keys (Up/Down/Left/Right) navigate between enabled options, wrapping at boundaries.
- Each radio button renders a hidden native `<input type="radio">` with the shared `name` attribute for form submission.
- Disabled options have `opacity: 0.5` and `cursor: not-allowed` for clear visual distinction.
