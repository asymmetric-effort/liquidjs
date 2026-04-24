import { test, expect } from '@playwright/test';

test.describe('Breadcrumb Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Breadcrumb Demo');
  });

  test('shows interactive breadcrumb section', async ({ page }) => {
    await expect(page.getByText('Interactive Breadcrumb')).toBeVisible();
  });

  test('shows collapsible section', async ({ page }) => {
    await expect(page.getByText('Collapsible (maxItems=3)')).toBeVisible();
  });

  test('shows custom separator section', async ({ page }) => {
    await expect(page.getByText('Custom Separator')).toBeVisible();
  });

  test('shows size variants section', async ({ page }) => {
    await expect(page.getByText('Size Variants')).toBeVisible();
  });
});
