import { test, expect } from '@playwright/test';

test.describe('Hypercube App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the app', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('shows the app container', async ({ page }) => {
    await expect(page.locator('.app')).toBeVisible();
  });

  test('shows dimension control', async ({ page }) => {
    await expect(page.locator('.control').first()).toBeVisible();
  });

  test('shows vertex and edge info', async ({ page }) => {
    await expect(page.locator('.info')).toBeVisible();
  });

  test('changes dimension slider', async ({ page }) => {
    const slider = page.locator('input[type="range"]').first();
    await slider.fill('5');
    await expect(page.locator('body')).not.toBeEmpty();
  });
});
