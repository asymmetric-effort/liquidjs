import { test, expect } from '@playwright/test';

test.describe('FlexContainer Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('FlexContainer Component Demo');
  });

  test('shows direction control', async ({ page }) => {
    await expect(page.getByText('Direction:')).toBeVisible();
  });

  test('shows wrap control', async ({ page }) => {
    await expect(page.getByText('Wrap:')).toBeVisible();
  });

  test('changes direction via select', async ({ page }) => {
    const select = page.locator('select').first();
    await select.selectOption('column');
    await expect(select).toHaveValue('column');
  });
});
