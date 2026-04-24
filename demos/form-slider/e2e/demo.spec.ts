import { test, expect } from '@playwright/test';

test.describe('Slider Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Slider');
    await expect(page.locator('.subtitle')).toHaveText('Range slider with marks, ticks, and dual handles');
  });

  test('key elements exist', async ({ page }) => {
    await expect(page.locator('h2', { hasText: 'Single Slider' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Range Slider' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'With Marks' })).toBeVisible();
    await expect(page.locator('.output').first()).toContainText('Value:');
  });

  test('toggling disabled control works', async ({ page }) => {
    const disabledToggle = page.locator('label', { hasText: 'Disabled' }).locator('input[type="checkbox"]');
    await disabledToggle.check();
    await expect(disabledToggle).toBeChecked();
  });

  test('show value label toggle works', async ({ page }) => {
    const showValueToggle = page.locator('label', { hasText: 'Show Value Label' }).locator('input[type="checkbox"]');
    await expect(showValueToggle).toBeChecked();
    await showValueToggle.uncheck();
    await expect(showValueToggle).not.toBeChecked();
  });
});
