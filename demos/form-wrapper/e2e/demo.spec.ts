import { test, expect } from '@playwright/test';

test.describe('FormFieldWrapper Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('FormFieldWrapper');
    await expect(page.locator('.subtitle')).toHaveText('Base container for all form field components');
  });

  test('key elements exist', async ({ page }) => {
    await expect(page.locator('h2', { hasText: 'Live Preview' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'With Error State' })).toBeVisible();
    await expect(page.locator('.controls')).toBeVisible();
  });

  test('required toggle works', async ({ page }) => {
    const requiredToggle = page.locator('label', { hasText: 'Required' }).locator('input[type="checkbox"]');
    await requiredToggle.check();
    await expect(requiredToggle).toBeChecked();
  });

  test('disabled toggle works', async ({ page }) => {
    const disabledToggle = page.locator('label', { hasText: 'Disabled' }).locator('input[type="checkbox"]');
    await disabledToggle.check();
    await expect(disabledToggle).toBeChecked();
  });

  test('show error control toggles error message', async ({ page }) => {
    const errorToggle = page.locator('label', { hasText: 'Show Error' }).locator('input[type="checkbox"]');
    await errorToggle.check();
    await expect(page.locator('text=This field has an error')).toBeVisible();
  });
});
