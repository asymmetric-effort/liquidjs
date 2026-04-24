import { test, expect } from '@playwright/test';

test.describe('Drawer Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Drawer Component Demo');
  });

  test('shows basic drawer section', async ({ page }) => {
    await expect(page.getByText('Basic Drawer')).toBeVisible();
  });

  test('shows position variants section', async ({ page }) => {
    await expect(page.getByText('Position Variants')).toBeVisible();
  });

  test('opens basic drawer on button click', async ({ page }) => {
    const openBtn = page.locator('.btn').first();
    await openBtn.click();
    await expect(page.locator('body')).not.toBeEmpty();
  });
});
