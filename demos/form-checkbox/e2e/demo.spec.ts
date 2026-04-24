import { test, expect } from '@playwright/test';

test.describe('Checkbox Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Checkbox');
    await expect(page.locator('.subtitle')).toHaveText('Custom styled checkbox with label and indeterminate state');
  });

  test('key elements exist', async ({ page }) => {
    await expect(page.locator('h2', { hasText: 'Live Preview' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Sizes' })).toBeVisible();
    await expect(page.locator('.controls')).toBeVisible();
    await expect(page.locator('.output')).toContainText('checked:');
  });

  test('toggling disabled control works', async ({ page }) => {
    const disabledToggle = page.locator('label', { hasText: 'Disabled' }).locator('input[type="checkbox"]');
    await disabledToggle.check();
    await expect(disabledToggle).toBeChecked();
    await disabledToggle.uncheck();
    await expect(disabledToggle).not.toBeChecked();
  });

  test('show error control toggles error message', async ({ page }) => {
    const errorToggle = page.locator('label', { hasText: 'Show Error' }).locator('input[type="checkbox"]');
    await errorToggle.check();
    await expect(page.locator('text=You must accept the terms')).toBeVisible();
    await errorToggle.uncheck();
    await expect(page.locator('text=You must accept the terms')).not.toBeVisible();
  });
});
