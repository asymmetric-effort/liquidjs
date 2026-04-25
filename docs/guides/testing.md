# Testing

SpecifyJS applications use three levels of testing.

## Unit Tests (Vitest + jsdom)

Test individual components and hooks in isolation:

```typescript
import { describe, it, expect } from 'vitest';
import { createElement } from 'specifyjs';
import { useState } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';

describe('Counter', () => {
  it('renders initial count', () => {
    const container = document.createElement('div');
    function Counter() {
      const [count] = useState(0);
      return createElement('span', null, String(count));
    }
    const root = createRoot(container);
    root.render(createElement(Counter, null));
    expect(container.innerHTML).toBe('<span>0</span>');
  });
});
```

## Integration Tests (Vitest + jsdom)

Test component trees and interactions:

```typescript
it('adds a todo', () => {
  root.render(createElement(TodoApp, null));
  // Simulate interaction, verify DOM changes
});
```

## E2E Tests (Playwright)

Test full user flows in a real browser:

```typescript
import { test, expect } from '@playwright/test';

test('adds a todo', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('todo-input').fill('Buy milk');
  await page.getByTestId('add-btn').click();
  await expect(page.locator('.todo-item')).toHaveCount(1);
});
```

## Running Tests

```bash
npm test                    # Unit + integration
npm run test:coverage       # With coverage thresholds
npm run test:e2e            # Playwright browser tests
```

## Coverage Requirements

- Statements: 95%+
- Branches: 94%+
- Functions: 97%+
- Lines: 95%+

## Next Steps

- [CI/CD](../contributing/ci-cd.md) — Automated testing in CI
- [Production Builds](production-builds.md) — Build optimization
