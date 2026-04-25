import { test, expect } from '@playwright/test';

test.describe('Component Reference', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/reference');
  });

  test('renders reference heading', async ({ page }) => {
    await expect(page.locator('.dialog-title')).toContainText('Component Reference');
  });

  test('displays API count', async ({ page }) => {
    await expect(page.locator('.dialog-body .section p').first()).toContainText('APIs');
  });

  test('shows category filter pills', async ({ page }) => {
    const body = page.locator('.dialog-body');
    await expect(body.locator('button')).toContainText(['All']);
    await expect(body.locator('.section')).toContainText('Core');
    await expect(body.locator('.section')).toContainText('Hooks');
    await expect(body.locator('.section')).toContainText('Router');
  });

  test('search filters APIs', async ({ page }) => {
    const body = page.locator('.dialog-body');
    await body.locator('input[placeholder="Search APIs..."]').fill('useState');
    await expect(body.locator('.section')).toContainText('useState');
    await expect(body.locator('.section')).toContainText('local state');
  });

  test('category filter shows only matching APIs', async ({ page }) => {
    const body = page.locator('.dialog-body');
    await body.locator('button:has-text("Router")').click();
    await expect(body.locator('.section')).toContainText('Route');
    await expect(body.locator('.section')).toContainText('Link');
    await expect(body.locator('.section')).toContainText('useParams');
  });

  test('shows no results message for empty search', async ({ page }) => {
    const body = page.locator('.dialog-body');
    await body.locator('input[placeholder="Search APIs..."]').fill('xyznonexistent');
    await expect(body.locator('.section')).toContainText('No matching APIs found');
  });
});
