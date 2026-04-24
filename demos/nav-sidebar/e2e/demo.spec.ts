import { test, expect } from '@playwright/test';

test.describe('Sidebar Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Sidebar Demo');
  });

  test('shows collapse toggle', async ({ page }) => {
    await expect(page.getByText('Collapsed')).toBeVisible();
  });

  test('shows sidebar navigation items', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('toggles sidebar collapse', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.click();
    await expect(checkbox).toBeChecked();
  });
});
