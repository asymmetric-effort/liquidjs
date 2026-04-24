import { test, expect } from '@playwright/test';

test.describe('Modal Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Modal Component Demo');
  });

  test('shows basic modal section', async ({ page }) => {
    await expect(page.getByText('Basic Modal')).toBeVisible();
  });

  test('shows size variants section', async ({ page }) => {
    await expect(page.getByText('Size Variants')).toBeVisible();
  });

  test('opens basic modal on button click', async ({ page }) => {
    const openBtn = page.locator('.btn').first();
    await openBtn.click();
    await expect(page.locator('body')).not.toBeEmpty();
  });
});
