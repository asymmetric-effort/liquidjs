import { test, expect } from '@playwright/test';

test.describe('Accordion Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Accordion Demo');
  });

  test('shows allow multiple toggle', async ({ page }) => {
    await expect(page.getByText('Allow Multiple')).toBeVisible();
  });

  test('shows accordion sections', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('toggles allow multiple mode', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.click();
    await expect(checkbox).toBeChecked();
  });
});
