import { test, expect } from '@playwright/test';

test.describe('Grid Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Grid Component Demo');
  });

  test('shows columns control', async ({ page }) => {
    await expect(page.getByText('Columns:')).toBeVisible();
  });

  test('shows gap control', async ({ page }) => {
    await expect(page.getByText('Gap:')).toBeVisible();
  });

  test('changes column count', async ({ page }) => {
    const input = page.locator('input[type="range"]').first();
    await input.fill('4');
    await expect(input).toHaveValue('4');
  });
});
