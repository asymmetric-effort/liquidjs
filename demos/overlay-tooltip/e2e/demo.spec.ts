import { test, expect } from '@playwright/test';

test.describe('Tooltip Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Tooltip Component Demo');
  });

  test('shows basic tooltip section', async ({ page }) => {
    await expect(page.getByText('Basic Tooltip')).toBeVisible();
  });

  test('shows placement variants section', async ({ page }) => {
    await expect(page.getByText('Placement Variants')).toBeVisible();
  });

  test('shows custom delay section', async ({ page }) => {
    await expect(page.getByText('Custom Delay')).toBeVisible();
  });

  test('hovers over tooltip trigger', async ({ page }) => {
    const btn = page.locator('.btn').first();
    await btn.hover();
    await expect(page.locator('body')).not.toBeEmpty();
  });
});
