# DOM API

The DOM module provides browser rendering APIs. Import from `specifyjs/dom`.

## createRoot

```typescript
import { createRoot } from 'specifyjs/dom';

const root = createRoot(document.getElementById('root'));
root.render(createElement(App, null));
root.unmount();
```

## hydrateRoot

Hydrate server-rendered HTML:

```typescript
import { hydrateRoot } from 'specifyjs/dom';

const root = hydrateRoot(document, createElement(App, null));
```

## createPortal

Render children into a different DOM subtree:

```typescript
import { createPortal } from 'specifyjs/dom';

createPortal(createElement(Modal, null), document.getElementById('modal-root'));
```

## flushSync

Force synchronous state updates (escape automatic batching):

```typescript
import { flushSync } from 'specifyjs/dom';

flushSync(() => {
  setState(newValue); // Updates DOM synchronously
});
```

## Legacy APIs

For migration from older patterns:

```typescript
import { render, hydrate, unmountComponentAtNode } from 'specifyjs/dom';

render(element, container, callback);
hydrate(element, container, callback);
unmountComponentAtNode(container);
```

## Event Handling

SpecifyJS uses a synthetic event system with cross-browser normalization:

```typescript
createElement('button', {
  onClick: (e) => { /* SyntheticMouseEvent */ },
  onKeyDown: (e) => { /* SyntheticKeyboardEvent */ },
});
```

Supported event types: Mouse, Keyboard, Focus, Input, Touch, Wheel, Drag, Pointer, Clipboard, Animation, Transition.
