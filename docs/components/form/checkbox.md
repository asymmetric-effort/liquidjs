# Checkbox

Custom styled checkbox with label. Uses a hidden native input paired with a visible styled div showing a checkmark or indeterminate indicator.

## Import

```ts
import { Checkbox } from '@aspect/form/checkbox';
import type { CheckboxProps } from '@aspect/form/checkbox';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | required | Whether the checkbox is checked |
| `onChange` | `(checked: boolean) => void` | required | Change handler |
| `label` | `string` | `undefined` | Label text displayed next to the checkbox |
| `indeterminate` | `boolean` | `false` | Indeterminate state. Overrides checkmark display with a dash |
| `disabled` | `boolean` | `false` | Disabled state |
| `error` | `string` | `undefined` | Error message |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |

### Size dimensions

| Size | Box | Icon | Font Size |
|------|-----|------|-----------|
| `sm` | 14px | 10px | 12px |
| `md` | 18px | 12px | 14px |
| `lg` | 22px | 16px | 16px |

## Usage

```ts
import { createElement } from 'specifyjs';
import { Checkbox } from '@aspect/form/checkbox';

// Basic checkbox
const basic = createElement(Checkbox, {
  label: 'Accept terms and conditions',
  checked: accepted,
  onChange: (val) => setAccepted(val),
});

// Indeterminate state (e.g., parent of partially selected children)
const parent = createElement(Checkbox, {
  label: 'Select all',
  checked: allSelected,
  indeterminate: someSelected && !allSelected,
  onChange: (val) => toggleAll(val),
});

// Small disabled checkbox
const disabled = createElement(Checkbox, {
  label: 'Read-only option',
  checked: true,
  onChange: () => {},
  disabled: true,
  size: 'sm',
});
```

## Features

- Three size variants (sm, md, lg) controlling box dimensions, icon size, and label font size.
- Indeterminate state displays a dash icon instead of a checkmark, useful for "select all" parent checkboxes.
- Checked and indeterminate states use a blue (#3b82f6) background with a white icon. Unchecked state shows a white background with a gray border.
- Error state changes the border color to red.
- Hidden native `<input type="checkbox">` is synced for form compatibility and indeterminate property support.
- Smooth transition on border color, background color, and opacity changes.
- Click and keyboard (Space, Enter) toggle the checked state.

## Accessibility

- The container uses `role="checkbox"` with `aria-checked` set to `'true'`, `'false'`, or `'mixed'` (for indeterminate).
- `aria-disabled` is set when the checkbox is disabled.
- The component is keyboard-focusable via `tabIndex` and responds to Space and Enter key presses.
- A hidden native checkbox input is rendered for form submission compatibility.
- The label is rendered as a `<span>` adjacent to the visual checkbox for consistent click targeting.
