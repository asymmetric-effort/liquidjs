import { test, expect } from '@playwright/test';

test.describe('VideoPlayer Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('VideoPlayer Demo');
  });

  test('shows custom controls section', async ({ page }) => {
    await expect(page.getByText('Custom Controls (default)')).toBeVisible();
  });

  test('shows event log section', async ({ page }) => {
    await expect(page.getByText('Event Log')).toBeVisible();
  });

  test('shows native controls section', async ({ page }) => {
    await expect(page.getByText('Native Controls')).toBeVisible();
  });

  test('shows muted loop section', async ({ page }) => {
    await expect(page.getByText('Muted + Loop')).toBeVisible();
  });
});
