# Slider

Custom range slider with support for single and dual handles (range mode), marks/ticks, and value display labels.

## Import

```ts
import { Slider } from '@aspect/form/slider';
import type { SliderProps, SliderMark } from '@aspect/form/slider';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number \| [number, number]` | required | Current value. Number for single mode, tuple for range mode |
| `onChange` | `(value: number \| [number, number]) => void` | required | Change handler |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Step increment |
| `showValue` | `boolean` | `false` | Show current value label above the thumb |
| `showTicks` | `boolean` | `false` | Show tick marks at each step along the track |
| `disabled` | `boolean` | `false` | Disabled state |
| `marks` | `SliderMark[]` | `undefined` | Named marks along the track |
| `range` | `boolean` | `false` | Enable range mode with dual handles |
| `label` | `string` | `undefined` | Label text |
| `error` | `string` | `undefined` | Error message |

### SliderMark

| Prop | Type | Description |
|------|------|-------------|
| `value` | `number` | Position value along the slider |
| `label` | `string` | Text label displayed below the mark |

## Usage

```ts
import { createElement } from 'liquidjs';
import { Slider } from '@aspect/form/slider';

// Basic slider
const basic = createElement(Slider, {
  label: 'Volume',
  value: volume,
  onChange: (val) => setVolume(val),
  min: 0,
  max: 100,
});

// Range slider with value labels
const priceRange = createElement(Slider, {
  label: 'Price Range',
  value: [minPrice, maxPrice],
  onChange: (val) => setPriceRange(val),
  range: true,
  min: 0,
  max: 1000,
  step: 50,
  showValue: true,
});

// Slider with marks
const temperature = createElement(Slider, {
  label: 'Temperature',
  value: temp,
  onChange: (val) => setTemp(val),
  min: 0,
  max: 100,
  marks: [
    { value: 0, label: 'Cold' },
    { value: 50, label: 'Warm' },
    { value: 100, label: 'Hot' },
  ],
  showTicks: true,
  step: 10,
});
```

## Features

- Single handle mode for selecting a single value, or dual handle range mode for selecting a value interval.
- Mouse drag interaction on thumb handles with global mousemove/mouseup listeners for smooth dragging.
- Click-on-track support that moves the nearest handle to the clicked position.
- Value snapping to step increments with min/max clamping.
- Value tooltip labels displayed above thumbs when `showValue` is enabled (dark background pill).
- Tick marks rendered at each step position when `showTicks` is enabled.
- Named marks with text labels positioned below the track.
- Blue fill bar indicates the selected range between min and the current value (or between the two handles in range mode).
- Disabled state grays out the fill bar and thumb borders, reduces opacity to 0.6.
- Keyboard support with Arrow keys for single mode: Left/Down decrements, Right/Up increments by step.

## Accessibility

- Each thumb uses `role="slider"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.
- Thumbs are keyboard-focusable via `tabIndex` and respond to arrow key input.
- Disabled thumbs have `tabIndex: -1` to remove them from the tab order.
- The track uses a pointer cursor (or `not-allowed` when disabled) to indicate interactivity.
