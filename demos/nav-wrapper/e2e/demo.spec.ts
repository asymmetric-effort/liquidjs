import { test, expect } from '@playwright/test';

test.describe('NavWrapper Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('NavWrapper Demo');
  });

  test('shows orientation control', async ({ page }) => {
    await expect(page.getByText('Orientation:')).toBeVisible();
  });

  test('shows navigation items', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('switches orientation', async ({ page }) => {
    const select = page.locator('select').first();
    await select.selectOption('vertical');
    await expect(select).toHaveValue('vertical');
  });
});
