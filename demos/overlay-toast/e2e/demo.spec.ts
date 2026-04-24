import { test, expect } from '@playwright/test';

test.describe('Toast Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Toast Component Demo');
  });

  test('shows toast types section', async ({ page }) => {
    await expect(page.getByText('Toast Types')).toBeVisible();
  });

  test('shows toast with action section', async ({ page }) => {
    await expect(page.getByText('Toast with Action')).toBeVisible();
  });

  test('shows persistent toast section', async ({ page }) => {
    await expect(page.getByText('Persistent Toast')).toBeVisible();
  });

  test('clicks a toast type button', async ({ page }) => {
    const btn = page.locator('.btn').first();
    await btn.click();
    await expect(page.locator('body')).not.toBeEmpty();
  });
});
