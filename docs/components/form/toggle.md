# Toggle

Toggle/switch component with a sliding pill animation. Provides an on/off control with configurable size, color, and label positioning.

## Import

```ts
import { Toggle } from '@aspect/form/toggle';
import type { ToggleProps } from '@aspect/form/toggle';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | required | Whether the toggle is on |
| `onChange` | `(checked: boolean) => void` | required | Change handler |
| `label` | `string` | `undefined` | Label text |
| `labelPosition` | `'left' \| 'right'` | `'right'` | Label position relative to the toggle |
| `disabled` | `boolean` | `false` | Disabled state |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| `onColor` | `string` | `'#3b82f6'` | Track color when on |
| `offColor` | `string` | `'#d1d5db'` | Track color when off |

### Size dimensions

| Size | Track Width | Track Height | Thumb Size |
|------|-------------|--------------|------------|
| `sm` | 32px | 18px | 14px |
| `md` | 44px | 24px | 20px |
| `lg` | 56px | 30px | 26px |

## Usage

```ts
import { createElement } from 'specifyjs';
import { Toggle } from '@aspect/form/toggle';

// Basic toggle
const basic = createElement(Toggle, {
  label: 'Enable notifications',
  checked: enabled,
  onChange: (val) => setEnabled(val),
});

// Custom colors and size
const custom = createElement(Toggle, {
  label: 'Dark mode',
  checked: darkMode,
  onChange: (val) => setDarkMode(val),
  size: 'lg',
  onColor: '#10b981',
  offColor: '#9ca3af',
  labelPosition: 'left',
});

// Disabled toggle
const disabled = createElement(Toggle, {
  label: 'Feature locked',
  checked: false,
  onChange: () => {},
  disabled: true,
});
```

## Features

- Three size variants (sm, md, lg) controlling track and thumb dimensions.
- Animated thumb slide with a 200ms CSS transition on `left` position.
- Track color animates between configurable on and off colors with a 200ms transition.
- Thumb rendered as a white circle with a subtle drop shadow.
- Label can be positioned to the left or right of the toggle track.
- Disabled state reduces opacity to 0.5 and changes cursor to `not-allowed`.
- Click and keyboard (Space, Enter) toggle the checked state.

## Accessibility

- The container uses `role="switch"` to identify the component as a toggle switch.
- `aria-checked` reflects the current on/off state.
- `aria-disabled` is set when the toggle is disabled.
- `aria-label` is set to the label text for screen reader identification.
- The component is keyboard-focusable via `tabIndex` and responds to Space and Enter key presses.
