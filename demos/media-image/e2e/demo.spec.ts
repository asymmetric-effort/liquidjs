import { test, expect } from '@playwright/test';

test.describe('Image Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Image Demo');
  });

  test('shows basic image section', async ({ page }) => {
    await expect(page.getByText('Basic Image')).toBeVisible();
  });

  test('shows with caption section', async ({ page }) => {
    await expect(page.getByText('With Caption')).toBeVisible();
  });

  test('shows placeholder types section', async ({ page }) => {
    await expect(page.getByText('Placeholder Types')).toBeVisible();
  });

  test('toggles broken image fallback', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.click();
    await expect(checkbox).toBeChecked();
  });
});
