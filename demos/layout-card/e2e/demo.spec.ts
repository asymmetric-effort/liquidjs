import { test, expect } from '@playwright/test';

test.describe('Card Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Card Component Demo');
  });

  test('shows hoverable checkbox', async ({ page }) => {
    await expect(page.getByText('Hoverable')).toBeVisible();
  });

  test('shows bordered checkbox', async ({ page }) => {
    await expect(page.getByText('Bordered')).toBeVisible();
  });

  test('shows shadow select', async ({ page }) => {
    await expect(page.getByText('Shadow:')).toBeVisible();
  });

  test('toggles hoverable checkbox', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.click();
    await expect(checkbox).not.toBeChecked();
  });
});
