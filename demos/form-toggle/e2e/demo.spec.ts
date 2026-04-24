import { test, expect } from '@playwright/test';

test.describe('Toggle Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Toggle');
    await expect(page.locator('.subtitle')).toHaveText('Toggle switch with sliding animation');
  });

  test('key elements exist', async ({ page }) => {
    await expect(page.locator('h2', { hasText: 'Live Preview' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Sizes' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Custom Colors' })).toBeVisible();
    await expect(page.locator('.output')).toContainText('checked:');
  });

  test('toggling disabled control works', async ({ page }) => {
    const disabledToggle = page.locator('label', { hasText: 'Disabled' }).locator('input[type="checkbox"]');
    await disabledToggle.check();
    await expect(disabledToggle).toBeChecked();
  });

  test('label left toggle works', async ({ page }) => {
    const labelLeftToggle = page.locator('label', { hasText: 'Label Left' }).locator('input[type="checkbox"]');
    await labelLeftToggle.check();
    await expect(labelLeftToggle).toBeChecked();
  });
});
