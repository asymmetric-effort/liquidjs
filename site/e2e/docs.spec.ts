import { test, expect } from '@playwright/test';

test.describe('Documentation Viewer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/docs');
    await expect(page.locator('text=Documentation').first()).toBeVisible({ timeout: 10000 });
  });

  test('renders docs viewer with section headers', async ({ page }) => {
    await expect(page.locator('button:has-text("GUIDES")').first()).toBeVisible();
    await expect(page.locator('button:has-text("API REFERENCE")').first()).toBeVisible();
  });

  test('sidebar shows all documentation sections', async ({ page }) => {
    await expect(page.locator('button:has-text("OVERVIEW")').first()).toBeVisible();
    await expect(page.locator('button:has-text("GUIDES")').first()).toBeVisible();
    await expect(page.locator('button:has-text("API REFERENCE")').first()).toBeVisible();
    await expect(page.locator('button:has-text("ARCHITECTURE")').first()).toBeVisible();
    await expect(page.locator('button:has-text("COMPONENTS")').first()).toBeVisible();
    await expect(page.locator('button:has-text("CONTRIBUTING")').first()).toBeVisible();
  });

  test('loads documentation home with welcome text', async ({ page }) => {
    await expect(page.locator('h1:has-text("SpecifyJS")').first()).toBeVisible();
  });
});

test.describe('Documentation Navigation', () => {
  test('navigates to Getting Started guide', async ({ page }) => {
    await page.goto('/#/docs/guides/getting-started');
    await expect(page.locator('h1').first()).toContainText('Getting Started', { timeout: 10000 });
  });

  test('navigates to Core Concepts guide', async ({ page }) => {
    await page.goto('/#/docs/guides/core-concepts');
    await expect(page.locator('h1').first()).toContainText('Core Concepts', { timeout: 10000 });
  });

  test('navigates to Routing guide', async ({ page }) => {
    await page.goto('/#/docs/guides/routing');
    await expect(page.locator('h1').first()).toContainText('Routing', { timeout: 10000 });
  });

  test('navigates to State Management guide', async ({ page }) => {
    await page.goto('/#/docs/guides/state-management');
    await expect(page.locator('h1').first()).toContainText('State Management', { timeout: 10000 });
  });

  test('navigates to Forms guide', async ({ page }) => {
    await page.goto('/#/docs/guides/forms-and-validation');
    await expect(page.locator('h1').first()).toContainText('Forms', { timeout: 10000 });
  });

  test('navigates to Performance guide', async ({ page }) => {
    await page.goto('/#/docs/guides/performance');
    await expect(page.locator('h1').first()).toContainText('Performance', { timeout: 10000 });
  });

  test('navigates to Error Handling guide', async ({ page }) => {
    await page.goto('/#/docs/guides/error-handling');
    await expect(page.locator('h1').first()).toContainText('Error Handling', { timeout: 10000 });
  });

  test('navigates to TypeScript guide', async ({ page }) => {
    await page.goto('/#/docs/guides/typescript');
    await expect(page.locator('h1').first()).toContainText('TypeScript', { timeout: 10000 });
  });

  test('navigates to Accessibility guide', async ({ page }) => {
    await page.goto('/#/docs/guides/accessibility');
    await expect(page.locator('h1').first()).toContainText('Accessibility', { timeout: 10000 });
  });

  test('navigates to Custom Hooks guide', async ({ page }) => {
    await page.goto('/#/docs/guides/custom-hooks');
    await expect(page.locator('h1').first()).toContainText('Custom Hooks', { timeout: 10000 });
  });

  test('navigates to Code Splitting guide', async ({ page }) => {
    await page.goto('/#/docs/guides/code-splitting');
    await expect(page.locator('h1').first()).toContainText('Code Splitting', { timeout: 10000 });
  });

  test('navigates to Concurrent Rendering guide', async ({ page }) => {
    await page.goto('/#/docs/guides/concurrent-rendering');
    await expect(page.locator('h1').first()).toContainText('Concurrent Rendering', { timeout: 10000 });
  });

  test('navigates to Deployment guide', async ({ page }) => {
    await page.goto('/#/docs/guides/deployment');
    await expect(page.locator('h1').first()).toContainText('Deployment', { timeout: 10000 });
  });

  test('navigates to Styling guide', async ({ page }) => {
    await page.goto('/#/docs/guides/styling');
    await expect(page.locator('h1').first()).toContainText('Styling', { timeout: 10000 });
  });

  test('navigates to Meta Tags guide', async ({ page }) => {
    await page.goto('/#/docs/guides/meta-tags');
    await expect(page.locator('h1').first()).toContainText('Meta Tags', { timeout: 10000 });
  });

  test('navigates to Feature Flags guide', async ({ page }) => {
    await page.goto('/#/docs/guides/feature-flags');
    await expect(page.locator('h1').first()).toContainText('Feature Flags', { timeout: 10000 });
  });

  test('navigates to Troubleshooting guide', async ({ page }) => {
    await page.goto('/#/docs/guides/troubleshooting');
    await expect(page.locator('h1').first()).toContainText('Troubleshooting', { timeout: 10000 });
  });

  test('navigates to Browser Support guide', async ({ page }) => {
    await page.goto('/#/docs/guides/browser-support');
    await expect(page.locator('h1').first()).toContainText('Browser Support', { timeout: 10000 });
  });
});

test.describe('Documentation API Reference', () => {
  test('navigates to Hooks API', async ({ page }) => {
    await page.goto('/#/docs/api/hooks');
    await expect(page.locator('h1').first()).toContainText('Hooks', { timeout: 10000 });
  });

  test('navigates to Components API', async ({ page }) => {
    await page.goto('/#/docs/api/components');
    await expect(page.locator('h1').first()).toContainText('Components', { timeout: 10000 });
  });

  test('navigates to DOM API', async ({ page }) => {
    await page.goto('/#/docs/api/dom');
    await expect(page.locator('h1').first()).toContainText('DOM', { timeout: 10000 });
  });

  test('navigates to Server API', async ({ page }) => {
    await page.goto('/#/docs/api/server');
    await expect(page.locator('h1').first()).toContainText('Pre-rendering', { timeout: 10000 });
  });

  test('navigates to Types API', async ({ page }) => {
    await page.goto('/#/docs/api/types');
    await expect(page.locator('h1').first()).toContainText('Types', { timeout: 10000 });
  });
});

test.describe('Documentation Architecture', () => {
  test('navigates to Architecture Overview', async ({ page }) => {
    await page.goto('/#/docs/architecture/README');
    await expect(page.locator('h1').first()).toContainText('Architecture', { timeout: 10000 });
  });

  test('navigates to Virtual DOM', async ({ page }) => {
    await page.goto('/#/docs/architecture/virtual-dom');
    await expect(page.locator('h1').first()).toContainText('Virtual DOM', { timeout: 10000 });
  });

  test('navigates to Fiber & Reconciler', async ({ page }) => {
    await page.goto('/#/docs/architecture/fiber-reconciler');
    await expect(page.locator('h1').first()).toContainText('Fiber', { timeout: 10000 });
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
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
  });

  test('handles nonexistent doc path gracefully', async ({ page }) => {
    await page.goto('/#/docs/nonexistent/path');
    const content = page.locator('body');
    await expect(content).toBeVisible();
  });
});

test.describe('Documentation from Reference Page', () => {
  test('reference page has link to docs', async ({ page }) => {
    await page.goto('/#/reference');
    await expect(page.locator('text=Documentation').first()).toBeVisible({ timeout: 10000 });
  });
});
