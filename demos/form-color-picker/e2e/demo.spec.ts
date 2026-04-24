import { test, expect } from '@playwright/test';

test.describe('ColorPicker Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('ColorPicker');
    await expect(page.locator('.subtitle')).toHaveText('Color selection with swatch grid and hex input');
  });

  test('key elements exist', async ({ page }) => {
    await expect(page.locator('h2', { hasText: 'Live Preview' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Custom Presets' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'No Input Field' })).toBeVisible();
    await expect(page.locator('.output')).toContainText('Color:');
  });

  test('toggling disabled control works', async ({ page }) => {
    const disabledToggle = page.locator('label', { hasText: 'Disabled' }).locator('input[type="checkbox"]');
    await disabledToggle.check();
    await expect(disabledToggle).toBeChecked();
    await disabledToggle.uncheck();
    await expect(disabledToggle).not.toBeChecked();
  });
});
