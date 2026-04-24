import { test, expect } from '@playwright/test';

test.describe('DatePicker Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('DatePicker');
    await expect(page.locator('.subtitle')).toHaveText('Calendar dropdown with month navigation and date constraints');
  });

  test('key elements exist', async ({ page }) => {
    await expect(page.locator('h2', { hasText: 'Live Preview' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'With Min/Max Constraints' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Pre-selected Date' })).toBeVisible();
    await expect(page.locator('.output')).toContainText('Selected:');
  });

  test('toggling disabled control works', async ({ page }) => {
    const disabledToggle = page.locator('label', { hasText: 'Disabled' }).locator('input[type="checkbox"]');
    await disabledToggle.check();
    await expect(disabledToggle).toBeChecked();
  });

  test('show error control toggles error message', async ({ page }) => {
    const errorToggle = page.locator('label', { hasText: 'Show Error' }).locator('input[type="checkbox"]');
    await errorToggle.check();
    await expect(page.locator('text=Date is required')).toBeVisible();
  });
});
