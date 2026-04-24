import { test, expect } from '@playwright/test';

test.describe('Tabs Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Tabs Component Demo');
  });

  test('shows position control', async ({ page }) => {
    await expect(page.getByText('Position:')).toBeVisible();
  });

  test('shows variant control', async ({ page }) => {
    await expect(page.getByText('Variant:')).toBeVisible();
  });

  test('shows tab content', async ({ page }) => {
    await expect(page.getByText('Overview')).toBeVisible();
  });

  test('switches tab position', async ({ page }) => {
    const select = page.locator('select').first();
    await select.selectOption('bottom');
    await expect(select).toHaveValue('bottom');
  });
});
