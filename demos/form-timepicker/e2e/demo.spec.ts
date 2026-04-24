import { test, expect } from '@playwright/test';

test.describe('TimePicker Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('TimePicker');
    await expect(page.locator('.subtitle')).toHaveText('Time selection with hour/minute spinners and AM/PM');
  });

  test('key elements exist', async ({ page }) => {
    await expect(page.locator('h2', { hasText: 'Live Preview' })).toBeVisible();
    await expect(page.locator('h2', { hasText: '15-Minute Steps' })).toBeVisible();
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
    await expect(page.locator('text=Invalid time')).toBeVisible();
  });

  test('12-hour format toggle works', async ({ page }) => {
    const formatToggle = page.locator('label', { hasText: '12-Hour Format' }).locator('input[type="checkbox"]');
    await formatToggle.check();
    await expect(formatToggle).toBeChecked();
  });
});
