import { test, expect } from '@playwright/test';

test.describe('FileUpload Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('FileUpload');
    await expect(page.locator('.subtitle')).toHaveText('Drag-and-drop file upload with size validation');
  });

  test('key elements exist', async ({ page }) => {
    await expect(page.locator('h2', { hasText: 'Single File Upload' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Multiple Files' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Any File Type' })).toBeVisible();
    await expect(page.locator('.output')).toContainText('Files:');
  });

  test('toggling disabled control works', async ({ page }) => {
    const disabledToggle = page.locator('label', { hasText: 'Disabled' }).locator('input[type="checkbox"]');
    await disabledToggle.check();
    await expect(disabledToggle).toBeChecked();
    await disabledToggle.uncheck();
    await expect(disabledToggle).not.toBeChecked();
  });
});
