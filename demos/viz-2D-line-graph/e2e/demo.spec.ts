import { test, expect } from '@playwright/test';

test.describe('2D Line Graph Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('2D Line Graph Demo');
  });

  test('shows interactive line graph section', async ({ page }) => {
    await expect(page.getByText('Interactive Line Graph')).toBeVisible();
  });

  test('shows controls', async ({ page }) => {
    await expect(page.locator('.controls')).toBeVisible();
  });

  test('shows custom colors section', async ({ page }) => {
    await expect(page.getByText('Custom Colors')).toBeVisible();
  });

  test('toggles a control checkbox', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.click();
    await expect(page.locator('body')).not.toBeEmpty();
  });
});
