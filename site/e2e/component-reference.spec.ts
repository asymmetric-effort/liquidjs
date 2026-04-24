import { test, expect } from '@playwright/test';

test.describe('Component Reference', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/reference');
  });

  test('renders reference heading', async ({ page }) => {
    await expect(page.locator('h2').first()).toContainText('Component Reference');
  });

  test('displays API count', async ({ page }) => {
    await expect(page.locator('.section p').first()).toContainText('APIs');
  });

  test('shows category filter pills', async ({ page }) => {
    await expect(page.locator('button')).toContainText(['All']);
    await expect(page.locator('.section')).toContainText('Core');
    await expect(page.locator('.section')).toContainText('Hooks');
    await expect(page.locator('.section')).toContainText('Router');
  });

  test('search filters APIs', async ({ page }) => {
    await page.locator('input[placeholder="Search APIs..."]').fill('useState');
    await expect(page.locator('.section')).toContainText('useState');
    await expect(page.locator('.section')).toContainText('local state');
  });

  test('category filter shows only matching APIs', async ({ page }) => {
    await page.click('button:has-text("Router")');
    await expect(page.locator('.section')).toContainText('Route');
    await expect(page.locator('.section')).toContainText('Link');
    await expect(page.locator('.section')).toContainText('useParams');
  });

  test('shows no results message for empty search', async ({ page }) => {
    await page.locator('input[placeholder="Search APIs..."]').fill('xyznonexistent');
    await expect(page.locator('.section')).toContainText('No matching APIs found');
  });
});
