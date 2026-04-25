# ColorPicker

Color selection component with a swatch grid, hex input field, and optional preset colors. Displays a color preview trigger that opens a dropdown panel.

## Import

```ts
import { ColorPicker } from '@aspect/form/color-picker';
import type { ColorPickerProps } from '@aspect/form/color-picker';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | required | Current color value as a hex string (e.g., `'#ff0000'`) |
| `onChange` | `(value: string) => void` | required | Change handler. Receives a normalized hex string |
| `presets` | `string[]` | 30 default colors | Preset color swatches displayed in the dropdown grid |
| `showInput` | `boolean` | `true` | Show the hex text input field in the dropdown |
| `showAlpha` | `boolean` | `false` | Reserved for future alpha/opacity slider support |
| `disabled` | `boolean` | `false` | Disabled state |
| `label` | `string` | `undefined` | Label text |

## Usage

```ts
import { createElement } from 'specifyjs';
import { ColorPicker } from '@aspect/form/color-picker';

// Basic color picker
const basic = createElement(ColorPicker, {
  label: 'Background Color',
  value: bgColor,
  onChange: (val) => setBgColor(val),
});

// Custom presets without hex input
const custom = createElement(ColorPicker, {
  label: 'Theme Color',
  value: themeColor,
  onChange: (val) => setThemeColor(val),
  presets: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  showInput: false,
});

// Disabled
const disabled = createElement(ColorPicker, {
  label: 'Locked Color',
  value: '#000000',
  onChange: () => {},
  disabled: true,
});
```

## Features

- Trigger displays a 36x36px color swatch preview alongside the hex value text.
- Dropdown panel (240px wide) contains a swatch grid and optional hex input.
- Default preset palette includes 30 colors arranged in a 10-column grid covering grays, primaries, and pastels.
- Swatch grid renders each color as a 20x20px clickable square. The selected color shows a darker border.
- Hex input field with live validation. Invalid hex values are reset to the current value on blur.
- Supports 3-digit, 6-digit, and 8-digit hex formats. Short hex values are automatically expanded (e.g., `#f00` becomes `#ff0000`).
- All output values are normalized to lowercase hex format.
- Hex input includes a small color preview square next to the text field.
- Outside click detection closes the dropdown automatically.
- Input value syncs with the `value` prop when it changes externally.

## Accessibility

- The hex text input has `aria-label="Hex color value"` for screen reader identification.
- Each swatch has a `title` attribute showing its hex value.
- The component is wrapped in a FormFieldWrapper for label display.
- Disabled state applies `cursor: not-allowed` to the trigger and all interactive elements.
