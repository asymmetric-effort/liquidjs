# Select

Custom dropdown select/combobox component. Renders a styled dropdown (not a native `<select>`) with support for search filtering, multiple selection, option grouping, keyboard navigation, and clearable selections.

## Import

```ts
import { Select } from '@aspect/form/select';
import type { SelectProps, SelectOption } from '@aspect/form/select';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `SelectOption[]` | required | Available options |
| `value` | `string \| string[]` | required | Current selected value. String for single select, array for multiple |
| `onChange` | `(value: string \| string[]) => void` | required | Change handler |
| `placeholder` | `string` | `'Select...'` | Placeholder text shown when nothing is selected |
| `searchable` | `boolean` | `false` | Enable search/filter by typing |
| `multiple` | `boolean` | `false` | Allow multiple selection |
| `clearable` | `boolean` | `false` | Show a clear button to reset the selection |
| `disabled` | `boolean` | `false` | Disabled state |
| `error` | `string` | `undefined` | Error message |
| `label` | `string` | `undefined` | Label text |
| `helpText` | `string` | `undefined` | Help text below the field |

### SelectOption

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | required | Option value |
| `label` | `string` | required | Display label |
| `disabled` | `boolean` | `undefined` | Whether this option is disabled |
| `group` | `string` | `undefined` | Group name. Options with the same group are displayed under a group header |

## Usage

```ts
import { createElement } from 'liquidjs';
import { Select } from '@aspect/form/select';

// Basic single select
const basic = createElement(Select, {
  label: 'Country',
  options: [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
  ],
  value: selected,
  onChange: (val) => setSelected(val),
  placeholder: 'Choose a country',
});

// Searchable multi-select with groups
const multi = createElement(Select, {
  label: 'Tags',
  options: [
    { value: 'bug', label: 'Bug', group: 'Type' },
    { value: 'feature', label: 'Feature', group: 'Type' },
    { value: 'high', label: 'High', group: 'Priority' },
    { value: 'low', label: 'Low', group: 'Priority' },
  ],
  value: selectedTags,
  onChange: (vals) => setSelectedTags(vals),
  searchable: true,
  multiple: true,
  clearable: true,
});
```

## Features

- Custom dropdown trigger with chevron indicator that rotates when open.
- Option grouping with uppercase group headers rendered inline.
- Search/filter input displayed at the top of the dropdown when `searchable` is enabled. Filters options by case-insensitive label match.
- Multiple selection mode with checkmark indicators on selected options.
- Clearable selection with an "X" button in the trigger area.
- Keyboard navigation: Arrow keys move focus through options, Enter selects, Escape closes the dropdown, Space/Enter/ArrowDown open it.
- Outside click detection closes the dropdown automatically.
- Selected value display with comma-separated labels for multi-select, and text truncation with ellipsis for overflow.
- Dropdown panel with max height of 240px and scroll overflow.
- "No options" placeholder when the filtered list is empty.

## Accessibility

- The trigger uses `role="combobox"` with `aria-expanded` and `aria-haspopup="listbox"`.
- The dropdown panel uses `role="listbox"`.
- Each option uses `role="option"` with `aria-selected` and `aria-disabled`.
- The clear button has `role="button"` with `aria-label="Clear selection"`.
- The trigger is focusable via `tabIndex` and supports full keyboard navigation.
- Disabled options are styled distinctly and cannot be selected.
