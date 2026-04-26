# Accessibility

Building accessible applications ensures that all users -- including those who rely on assistive technologies, keyboard navigation, or alternative input devices -- can interact with your UI. SpecifyJS renders standard DOM elements, so all native accessibility features of HTML and ARIA are available through `createElement`.

## ARIA Attributes

Pass ARIA attributes as props. SpecifyJS forwards them directly to the DOM:

```typescript
import { createElement } from 'specifyjs';

function Alert(props: { message: string }) {
  return createElement('div', {
    role: 'alert',
    'aria-live': 'assertive',
  }, props.message);
}

function ProgressBar(props: { value: number; max: number }) {
  return createElement('div', {
    role: 'progressbar',
    'aria-valuenow': props.value,
    'aria-valuemin': 0,
    'aria-valuemax': props.max,
    'aria-label': 'Loading progress',
    style: `width: ${(props.value / props.max) * 100}%`,
  });
}
```

## Semantic HTML

Use the correct HTML elements rather than applying ARIA roles to generic `div` and `span` elements. Semantic elements carry built-in accessibility semantics that assistive technologies understand without extra attributes:

```typescript
function PageLayout() {
  return createElement('div', null,
    createElement('header', null,
      createElement('nav', { 'aria-label': 'Main navigation' },
        createElement('ul', null,
          createElement('li', null, createElement('a', { href: '#home' }, 'Home')),
          createElement('li', null, createElement('a', { href: '#about' }, 'About')),
        ),
      ),
    ),
    createElement('main', null,
      createElement('article', null,
        createElement('h1', null, 'Page Title'),
        createElement('p', null, 'Content goes here.'),
      ),
    ),
    createElement('footer', null,
      createElement('p', null, 'Copyright 2026'),
    ),
  );
}
```

Prefer `button` over `div` with `onClick`, `a` for navigation, `input` and `label` for forms, and heading elements (`h1`-`h6`) for document structure.

## Keyboard Navigation

Interactive components must be operable via keyboard. Handle `onKeyDown` to support expected key bindings:

```typescript
function DropdownMenu(props: { items: string[]; onSelect: (item: string) => void }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleKeyDown = (e: Event): void => {
    const key = (e as KeyboardEvent).key;
    if (key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, props.items.length - 1));
    } else if (key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (key === 'Enter') {
      props.onSelect(props.items[activeIndex]);
      setOpen(false);
    } else if (key === 'Escape') {
      setOpen(false);
    }
  };

  return createElement('div', { onKeyDown: handleKeyDown },
    createElement('button', {
      'aria-haspopup': 'listbox',
      'aria-expanded': open,
      onClick: () => setOpen(o => !o),
    }, 'Select item'),
    open
      ? createElement('ul', { role: 'listbox' },
          ...props.items.map((item, i) =>
            createElement('li', {
              key: item,
              role: 'option',
              'aria-selected': i === activeIndex,
              tabindex: i === activeIndex ? 0 : -1,
              onClick: () => { props.onSelect(item); setOpen(false); },
            }, item),
          ),
        )
      : null,
  );
}
```

## Focus Management with useRef

Manage focus programmatically when the UI changes -- after opening a modal, navigating to a new route, or revealing content:

```typescript
import { useRef, useEffect, createElement } from 'specifyjs';
import type { RefObject } from 'specifyjs';

function Modal(props: { open: boolean; onClose: () => void; children: SpecNode }) {
  const closeRef: RefObject<HTMLButtonElement> = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (props.open) {
      closeRef.current?.focus();
    }
  }, [props.open]);

  if (!props.open) return null;

  return createElement('div', {
    role: 'dialog',
    'aria-modal': true,
    'aria-label': 'Dialog',
  },
    createElement('button', {
      ref: closeRef,
      onClick: props.onClose,
      'aria-label': 'Close dialog',
    }, 'X'),
    props.children,
  );
}
```

## Screen Reader Considerations

- **Live regions**: Use `aria-live="polite"` for non-urgent updates (e.g., search result counts) and `aria-live="assertive"` for critical information (e.g., form errors).
- **Hidden content**: Use `aria-hidden="true"` to hide decorative elements from assistive technologies.
- **Labels**: Every interactive element needs an accessible name -- either visible text content, an `aria-label`, or an association via `aria-labelledby`.
- **Descriptions**: Provide `aria-describedby` to link form fields to help text or error messages.

```typescript
function FormField(props: { id: string; label: string; error?: string }) {
  const errorId = `${props.id}-error`;
  return createElement('div', null,
    createElement('label', { htmlFor: props.id }, props.label),
    createElement('input', {
      id: props.id,
      'aria-invalid': props.error ? true : undefined,
      'aria-describedby': props.error ? errorId : undefined,
    }),
    props.error
      ? createElement('span', {
          id: errorId,
          role: 'alert',
          'aria-live': 'assertive',
        }, props.error)
      : null,
  );
}
```

## Common ARIA Roles

| Role          | Element         | When to use                                   |
|---------------|-----------------|-----------------------------------------------|
| `alert`       | `div`, `span`   | Important messages that need immediate attention |
| `dialog`      | `div`           | Modal or non-modal dialogs                    |
| `navigation`  | `nav`           | Groups of navigation links (prefer `<nav>`)   |
| `tablist`     | `div`           | Container for a set of tabs                   |
| `tab`         | `button`        | Individual tab control                        |
| `tabpanel`    | `div`           | Content associated with a tab                 |
| `listbox`     | `ul`            | Selectable list of options                    |
| `option`      | `li`            | Individual option within a listbox            |
| `progressbar` | `div`           | Displays progress of a task                   |
| `status`      | `div`           | Advisory information (pairs with `aria-live`)  |

## Testing Accessibility

Validate accessibility at multiple levels:

1. **Automated checks** -- Use axe-core in integration tests to catch missing labels, contrast issues, and invalid ARIA.
2. **Keyboard testing** -- Verify all interactive elements are reachable via Tab, Enter, Space, Escape, and arrow keys.
3. **Screen reader testing** -- Test with VoiceOver, NVDA, or Orca to confirm announcements and navigation flow.
4. **Playwright E2E tests** -- Assert focus position and `aria-*` attribute values after interactions.

```typescript
// Example Playwright assertion
const dialog = page.locator('[role="dialog"]');
await expect(dialog).toHaveAttribute('aria-modal', 'true');
await expect(dialog.locator('button')).toBeFocused();
```

## See Also

- [Core Concepts](./core-concepts.md)
- [API Reference: createElement](../api/create-element.md)
- [API Reference: useRef](../api/hooks.md#useref)
