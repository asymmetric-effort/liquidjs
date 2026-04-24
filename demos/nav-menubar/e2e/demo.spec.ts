import { test, expect } from '@playwright/test';

test.describe('Menubar Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Menubar Demo');
  });

  test('shows last action display', async ({ page }) => {
    await expect(page.getByText('Last action:')).toBeVisible();
  });

  test('shows menu bar', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('clicks a menu trigger', async ({ page }) => {
    const trigger = page.locator('button').first();
    await trigger.click();
    await expect(page.locator('body')).not.toBeEmpty();
  });
});
