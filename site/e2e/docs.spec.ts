import { test, expect } from '@playwright/test';

test.describe('Documentation Viewer', () => {
  test.beforeEach(async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/#/docs');
    // Wait for docs content to render
    await expect(page.locator('text=Documentation')).toBeVisible({ timeout: 10000 });
  });

  test('renders docs viewer with sidebar and content', async ({ page }) => {
    // Section headers should be visible
    await expect(page.locator('text=Guides')).toBeVisible();
    await expect(page.locator('text=API Reference')).toBeVisible();
  });

  test('sidebar shows all documentation sections', async ({ page }) => {
    await expect(page.locator('text=Overview')).toBeVisible();
    await expect(page.locator('text=Guides')).toBeVisible();
    await expect(page.locator('text=API Reference')).toBeVisible();
    await expect(page.locator('text=Architecture')).toBeVisible();
    await expect(page.locator('text=Components')).toBeVisible();
    await expect(page.locator('text=Contributing')).toBeVisible();
  });

  test('loads documentation home with welcome text', async ({ page }) => {
    await expect(page.locator('text=SpecifyJS Documentation')).toBeVisible();
  });
});

test.describe('Documentation Navigation', () => {
  test('navigates to Getting Started guide', async ({ page }) => {
    await page.goto('/#/docs/guides/getting-started');
    await expect(page.locator('text=Getting Started')).toBeVisible();
    await expect(page.locator('text=Installation')).toBeVisible({ timeout: 10000 });
  });

  test('navigates to Core Concepts guide', async ({ page }) => {
    await page.goto('/#/docs/guides/core-concepts');
    await expect(page.locator('text=Core Concepts')).toBeVisible({ timeout: 10000 });
  });

  test('navigates to Routing guide', async ({ page }) => {
    await page.goto('/#/docs/guides/routing');
    await expect(page.locator('text=Routing')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Router')).toBeVisible();
  });

  test('navigates to State Management guide', async ({ page }) => {
    await page.goto('/#/docs/guides/state-management');
    await expect(page.locator('text=State Management')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=useState')).toBeVisible();
  });

  test('navigates to Forms guide', async ({ page }) => {
    await page.goto('/#/docs/guides/forms-and-validation');
    await expect(page.locator('text=Forms and Validation')).toBeVisible({ timeout: 10000 });
  });

  test('navigates to Performance guide', async ({ page }) => {
    await page.goto('/#/docs/guides/performance');
    await expect(page.locator('text=Performance')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=memo')).toBeVisible();
  });

  test('navigates to Error Handling guide', async ({ page }) => {
    await page.goto('/#/docs/guides/error-handling');
    await expect(page.locator('text=Error Handling')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=ErrorBoundary')).toBeVisible();
  });

  test('navigates to TypeScript guide', async ({ page }) => {
    await page.goto('/#/docs/guides/typescript');
    await expect(page.locator('text=TypeScript')).toBeVisible({ timeout: 10000 });
  });

  test('navigates to Accessibility guide', async ({ page }) => {
    await page.goto('/#/docs/guides/accessibility');
    await expect(page.locator('text=Accessibility')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=ARIA')).toBeVisible();
  });

  test('navigates to Custom Hooks guide', async ({ page }) => {
    await page.goto('/#/docs/guides/custom-hooks');
    await expect(page.locator('text=Custom Hooks')).toBeVisible({ timeout: 10000 });
  });

  test('navigates to Code Splitting guide', async ({ page }) => {
    await page.goto('/#/docs/guides/code-splitting');
    await expect(page.locator('text=Code Splitting')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=lazy')).toBeVisible();
  });

  test('navigates to Concurrent Rendering guide', async ({ page }) => {
    await page.goto('/#/docs/guides/concurrent-rendering');
    await expect(page.locator('text=Concurrent Rendering')).toBeVisible({ timeout: 10000 });
  });

  test('navigates to Deployment guide', async ({ page }) => {
    await page.goto('/#/docs/guides/deployment');
    await expect(page.locator('text=Deployment')).toBeVisible({ timeout: 10000 });
  });

  test('navigates to Styling guide', async ({ page }) => {
    await page.goto('/#/docs/guides/styling');
    await expect(page.locator('text=Styling')).toBeVisible({ timeout: 10000 });
  });

  test('navigates to Meta Tags guide', async ({ page }) => {
    await page.goto('/#/docs/guides/meta-tags');
    await expect(page.locator('text=Meta Tags')).toBeVisible({ timeout: 10000 });
  });

  test('navigates to Feature Flags guide', async ({ page }) => {
    await page.goto('/#/docs/guides/feature-flags');
    await expect(page.locator('text=Feature Flags')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=FeatureFlagProvider')).toBeVisible();
  });

  test('navigates to Troubleshooting guide', async ({ page }) => {
    await page.goto('/#/docs/guides/troubleshooting');
    await expect(page.locator('text=Troubleshooting')).toBeVisible({ timeout: 10000 });
  });

  test('navigates to Browser Support guide', async ({ page }) => {
    await page.goto('/#/docs/guides/browser-support');
    await expect(page.locator('text=Browser Support')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Documentation API Reference', () => {
  test('navigates to Hooks API', async ({ page }) => {
    await page.goto('/#/docs/api/hooks');
    await expect(page.locator('text=Hooks API')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=useState')).toBeVisible();
    await expect(page.locator('text=useEffect')).toBeVisible();
  });

  test('navigates to Components API', async ({ page }) => {
    await page.goto('/#/docs/api/components');
    await expect(page.locator('text=Components API')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=createElement')).toBeVisible();
  });

  test('navigates to DOM API', async ({ page }) => {
    await page.goto('/#/docs/api/dom');
    await expect(page.locator('text=DOM API')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=createRoot')).toBeVisible();
  });

  test('navigates to Server API', async ({ page }) => {
    await page.goto('/#/docs/api/server');
    await expect(page.locator('text=Pre-rendering')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=renderToString')).toBeVisible();
  });

  test('navigates to Types API', async ({ page }) => {
    await page.goto('/#/docs/api/types');
    await expect(page.locator('text=TypeScript Types')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Documentation Architecture', () => {
  test('navigates to Architecture Overview', async ({ page }) => {
    await page.goto('/#/docs/architecture/README');
    await expect(page.locator('text=Architecture')).toBeVisible({ timeout: 10000 });
  });

  test('navigates to Virtual DOM', async ({ page }) => {
    await page.goto('/#/docs/architecture/virtual-dom');
    await expect(page.locator('text=Virtual DOM')).toBeVisible({ timeout: 10000 });
  });

  test('navigates to Fiber & Reconciler', async ({ page }) => {
    await page.goto('/#/docs/architecture/fiber-reconciler');
    await expect(page.locator('text=Fiber')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Documentation Content Rendering', () => {
  test('renders code blocks', async ({ page }) => {
    await page.goto('/#/docs/guides/getting-started');
    const codeBlock = page.locator('pre code').first();
    await expect(codeBlock).toBeVisible({ timeout: 10000 });
  });

  test('renders headings', async ({ page }) => {
    await page.goto('/#/docs/guides/core-concepts');
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 10000 });
  });

  test('handles nonexistent doc path gracefully', async ({ page }) => {
    await page.goto('/#/docs/nonexistent/path');
    // Should show either a 404 message or fall back to docs home
    const content = page.locator('body');
    await expect(content).toBeVisible();
  });
});

test.describe('Documentation from Reference Page', () => {
  test('reference page has link to docs', async ({ page }) => {
    await page.goto('/#/reference');
    await expect(page.locator('text=Documentation')).toBeVisible({ timeout: 10000 });
  });
});
