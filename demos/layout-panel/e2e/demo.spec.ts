import { test, expect } from '@playwright/test';

test.describe('Panel Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Panel Component Demo');
  });

  test('shows collapsible checkbox', async ({ page }) => {
    await expect(page.getByText('Collapsible')).toBeVisible();
  });

  test('shows bordered checkbox', async ({ page }) => {
    await expect(page.getByText('Bordered')).toBeVisible();
  });

  test('toggles collapsible setting', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]').first();
    const initialState = await checkbox.isChecked();
    await checkbox.click();
    await expect(checkbox).toBeChecked({ checked: !initialState });
  });
});
