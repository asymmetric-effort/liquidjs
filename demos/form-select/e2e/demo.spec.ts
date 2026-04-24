import { test, expect } from '@playwright/test';

test.describe('Select Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Select');
    await expect(page.locator('.subtitle')).toHaveText('Dropdown select with search, multi-select, and clearable');
  });

  test('key elements exist', async ({ page }) => {
    await expect(page.locator('h2', { hasText: 'Single Select' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Multi Select' })).toBeVisible();
    await expect(page.locator('.output').first()).toContainText('Selected:');
  });

  test('toggling disabled control works', async ({ page }) => {
    const disabledToggle = page.locator('label', { hasText: 'Disabled' }).locator('input[type="checkbox"]');
    await disabledToggle.check();
    await expect(disabledToggle).toBeChecked();
  });

  test('show error control toggles error message', async ({ page }) => {
    const errorToggle = page.locator('label', { hasText: 'Show Error' }).locator('input[type="checkbox"]');
    await errorToggle.check();
    await expect(page.locator('text=Selection required')).toBeVisible();
  });
});
