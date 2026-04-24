import { test, expect } from '@playwright/test';

test.describe('TextField Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('TextField');
    await expect(page.locator('.subtitle')).toHaveText('Single-line text input with label, help text, and validation');
  });

  test('key elements exist', async ({ page }) => {
    await expect(page.locator('h2', { hasText: 'Live Preview' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Password Field' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'With Prefix & Suffix' })).toBeVisible();
  });

  test('toggling disabled control works', async ({ page }) => {
    const disabledToggle = page.locator('label', { hasText: 'Disabled' }).locator('input[type="checkbox"]');
    await disabledToggle.check();
    await expect(disabledToggle).toBeChecked();
  });

  test('show error control toggles error message', async ({ page }) => {
    const errorToggle = page.locator('label', { hasText: 'Show Error' }).locator('input[type="checkbox"]');
    await errorToggle.check();
    await expect(page.locator('text=Username is required')).toBeVisible();
  });
});
