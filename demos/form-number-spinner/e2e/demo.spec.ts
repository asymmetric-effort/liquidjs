import { test, expect } from '@playwright/test';

test.describe('NumberSpinner Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('NumberSpinner');
    await expect(page.locator('.subtitle')).toHaveText('Numeric input with increment/decrement buttons and keyboard support');
  });

  test('key elements exist', async ({ page }) => {
    await expect(page.locator('h2', { hasText: 'Live Preview' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'With Prefix & Suffix' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Large Step' })).toBeVisible();
    await expect(page.locator('.output')).toContainText('Value:');
  });

  test('toggling disabled control works', async ({ page }) => {
    const disabledToggle = page.locator('label', { hasText: 'Disabled' }).locator('input[type="checkbox"]');
    await disabledToggle.check();
    await expect(disabledToggle).toBeChecked();
  });

  test('show error control toggles error message', async ({ page }) => {
    const errorToggle = page.locator('label', { hasText: 'Show Error' }).locator('input[type="checkbox"]');
    await errorToggle.check();
    await expect(page.locator('text=Quantity must be positive')).toBeVisible();
  });
});
