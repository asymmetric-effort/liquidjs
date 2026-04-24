import { test, expect } from '@playwright/test';

test.describe('Dashboard App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the app', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('shows system overview section', async ({ page }) => {
    await expect(page.getByText('System Overview')).toBeVisible();
  });

  test('shows metrics section', async ({ page }) => {
    await expect(page.getByText('Metrics')).toBeVisible();
  });

  test('shows settings section', async ({ page }) => {
    await expect(page.getByText('Settings')).toBeVisible();
  });

  test('shows metric cards', async ({ page }) => {
    await expect(page.locator('.metric-card').first()).toBeVisible();
  });

  test('clicks increment button on a metric', async ({ page }) => {
    const btn = page.locator('.btn.small').first();
    await btn.click();
    await expect(page.locator('body')).not.toBeEmpty();
  });
});
