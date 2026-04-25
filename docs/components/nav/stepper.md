# Stepper

Step wizard indicator component. Renders a sequence of step circles or dots connected by lines, showing completed, active, and pending states. Supports horizontal and vertical orientations, clickable steps, and visual variants.

## Import

```ts
import { Stepper } from '@specifyjs/components/nav/stepper';
import type { StepperProps, StepItem, StepperOrientation, StepperVariant } from '@specifyjs/components/nav/stepper';
```

## Props

### StepperProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `StepItem[]` | *required* | Array of step definitions. |
| `currentStep` | `number` | *required* | Current active step (0-based index). |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout orientation. |
| `onChange` | `(step: number) => void` | `undefined` | Called when a step is clicked (receives the step index). |
| `clickable` | `boolean` | `false` | Whether steps are clickable. |
| `variant` | `'circle' \| 'dot'` | `'circle'` | Visual variant for step indicators. |

### StepItem

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | `string` | *required* | Step label text. |
| `description` | `string` | `undefined` | Optional description shown below the label. |
| `icon` | `string` | `undefined` | Optional icon text (emoji or character) shown inside the circle. |

## Usage

```ts
import { createElement } from '@specifyjs/core';
import { Stepper } from '@specifyjs/components/nav/stepper';

const stepper = createElement(Stepper, {
  steps: [
    { label: 'Account', description: 'Create your account' },
    { label: 'Profile', description: 'Set up your profile' },
    { label: 'Review', description: 'Review and confirm' },
    { label: 'Done', description: 'All set!' },
  ],
  currentStep: 1,
  orientation: 'horizontal',
  clickable: true,
  variant: 'circle',
  onChange: (step) => console.log('Step selected:', step),
});
```

## Features

- **Three step states** -- steps are rendered as completed (filled blue circle with checkmark), active (outlined circle with shadow), or pending (outlined gray circle).
- **Circle and dot variants** -- `circle` shows numbered/icon indicators (32px); `dot` shows smaller indicators (12px).
- **Connector lines** -- lines between steps reflect completion state with color transitions.
- **Horizontal and vertical orientations** -- full layout support for both directions.
- **Clickable steps** -- optionally allow users to jump to any step by clicking.
- **Step descriptions** -- optional secondary text displayed below each step label.
- **Custom icons** -- provide icon text that replaces the default step number inside circle indicators.
- **Animated transitions** -- background color and border color transitions on state changes.

## Accessibility

- The component uses `role="navigation"` with `aria-label="Progress steps"`.
- The currently active step is marked with `aria-current="step"`.
- When clickable, steps render as `<button>` elements for keyboard access; otherwise they render as `<div>` elements.
- Step labels and descriptions provide textual context for screen readers.
- Visual indicators (circles, dots, connector lines) communicate progress through color differentiation.
