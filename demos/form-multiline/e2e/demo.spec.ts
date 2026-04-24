import { test, expect } from '@playwright/test';

test.describe('MultilineField Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('MultilineField');
    await expect(page.locator('.subtitle')).toHaveText('Multi-line textarea with character count and auto-resize');
  });

  test('key elements exist', async ({ page }) => {
    await expect(page.locator('h2', { hasText: 'Live Preview' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Auto-Resize' })).toBeVisible();
    await expect(page.locator('.controls')).toBeVisible();
  });

  test('toggling disabled control works', async ({ page }) => {
    const disabledToggle = page.locator('label', { hasText: 'Disabled' }).locator('input[type="checkbox"]');
    await disabledToggle.check();
    await expect(disabledToggle).toBeChecked();
  });

  test('show error control toggles error message', async ({ page }) => {
    const errorToggle = page.locator('label', { hasText: 'Show Error' }).locator('input[type="checkbox"]');
    await errorToggle.check();
    await expect(page.locator('text=Description is too short')).toBeVisible();
  });

  test('show count toggle works', async ({ page }) => {
    const countToggle = page.locator('label', { hasText: 'Show Count' }).locator('input[type="checkbox"]');
    await expect(countToggle).toBeChecked();
    await countToggle.uncheck();
    await expect(countToggle).not.toBeChecked();
  });
});
