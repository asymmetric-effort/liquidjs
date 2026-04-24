import { test, expect } from '@playwright/test';

test.describe('RadioGroup Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('RadioGroup');
    await expect(page.locator('.subtitle')).toHaveText('Radio button group with keyboard navigation');
  });

  test('key elements exist', async ({ page }) => {
    await expect(page.locator('h2', { hasText: 'Live Preview' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'With Disabled Option' })).toBeVisible();
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
    await expect(page.locator('text=Please select a color')).toBeVisible();
  });

  test('horizontal toggle works', async ({ page }) => {
    const horizontalToggle = page.locator('label', { hasText: 'Horizontal' }).locator('input[type="checkbox"]');
    await horizontalToggle.check();
    await expect(horizontalToggle).toBeChecked();
  });
});
