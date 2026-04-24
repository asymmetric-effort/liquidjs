import { test, expect } from '@playwright/test';

test.describe('ScrollContainer Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('ScrollContainer Component Demo');
  });

  test('shows direction control', async ({ page }) => {
    await expect(page.getByText('Direction:')).toBeVisible();
  });

  test('shows scrollbar visibility control', async ({ page }) => {
    await expect(page.getByText('Scrollbar:')).toBeVisible();
  });

  test('changes scroll direction', async ({ page }) => {
    const select = page.locator('select').first();
    await select.selectOption('horizontal');
    await expect(select).toHaveValue('horizontal');
  });
});
