import { test, expect } from '@playwright/test';

test.describe('Toolbar Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Toolbar Demo');
  });

  test('shows last action display', async ({ page }) => {
    await expect(page.getByText('Last action:')).toBeVisible();
  });

  test('shows size control', async ({ page }) => {
    await expect(page.getByText('Size:')).toBeVisible();
  });

  test('clicks a toolbar button', async ({ page }) => {
    const btn = page.locator('button').first();
    await btn.click();
    await expect(page.locator('body')).not.toBeEmpty();
  });
});
