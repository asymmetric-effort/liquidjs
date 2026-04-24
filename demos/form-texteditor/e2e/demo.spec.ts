import { test, expect } from '@playwright/test';

test.describe('TextEditor Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('TextEditor');
    await expect(page.locator('.subtitle')).toHaveText('WYSIWYG rich text editor with toolbar');
  });

  test('key elements exist', async ({ page }) => {
    await expect(page.locator('h2', { hasText: 'Live Preview' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Minimal Toolbar' })).toBeVisible();
    await expect(page.locator('.output')).toContainText('HTML length:');
  });

  test('toggling disabled control works', async ({ page }) => {
    const disabledToggle = page.locator('label', { hasText: 'Disabled' }).locator('input[type="checkbox"]');
    await disabledToggle.check();
    await expect(disabledToggle).toBeChecked();
  });

  test('read only toggle works', async ({ page }) => {
    const readOnlyToggle = page.locator('label', { hasText: 'Read Only' }).locator('input[type="checkbox"]');
    await readOnlyToggle.check();
    await expect(readOnlyToggle).toBeChecked();
  });

  test('show error control toggles error message', async ({ page }) => {
    const errorToggle = page.locator('label', { hasText: 'Show Error' }).locator('input[type="checkbox"]');
    await errorToggle.check();
    await expect(page.locator('text=Content is required')).toBeVisible();
  });
});
