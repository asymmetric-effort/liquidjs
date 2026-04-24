import { test, expect } from '@playwright/test';

test.describe('Splitter Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Splitter Component Demo');
  });

  test('shows direction control', async ({ page }) => {
    await expect(page.getByText('Direction:')).toBeVisible();
  });

  test('shows pane 1 and pane 2', async ({ page }) => {
    await expect(page.getByText('Pane 1')).toBeVisible();
    await expect(page.getByText('Pane 2')).toBeVisible();
  });

  test('changes split direction', async ({ page }) => {
    const select = page.locator('select').first();
    await select.selectOption('vertical');
    await expect(select).toHaveValue('vertical');
  });
});
