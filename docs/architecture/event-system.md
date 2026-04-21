# Event System

## Synthetic Events

LiquidJS wraps native browser events in synthetic event objects for cross-browser consistency:

| Class | Native Event | Properties |
|-------|-------------|------------|
| `SyntheticEvent` | `Event` | type, target, preventDefault, stopPropagation |
| `SyntheticMouseEvent` | `MouseEvent` | clientX/Y, button, altKey, ctrlKey, getModifierState |
| `SyntheticKeyboardEvent` | `KeyboardEvent` | key, code, shiftKey, repeat, getModifierState |
| `SyntheticFocusEvent` | `FocusEvent` | relatedTarget |
| `SyntheticInputEvent` | `InputEvent` | data, inputType |
| `SyntheticTouchEvent` | `TouchEvent` | touches, targetTouches, changedTouches |
| `SyntheticWheelEvent` | `WheelEvent` | deltaX/Y/Z, deltaMode |

## Event Name Mapping

React-style camelCase names map to DOM events:

```
onClick     → click
onKeyDown   → keydown
onChange    → change
onSubmit    → submit
onMouseMove → mousemove
```

50+ events are supported including pointer, drag, clipboard, animation, and transition events.

## Event Registration

Events are registered directly on DOM elements via `addEventListener` during the commit phase. When props change, old listeners are removed and new ones attached.

```typescript
// In updateDOMProperties:
if (EVENT_RE.test(key)) {
  const eventName = key.slice(2).toLowerCase();
  dom.addEventListener(eventName, handler);
}
```

## No Event Pooling

Unlike React 16 and earlier, LiquidJS does not pool synthetic events. The `persist()` method is a no-op for API compatibility.
