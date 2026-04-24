import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('loads home page by default', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('LiquidJS');
  });

  test('navigates to Components via nav link', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Components');
    await expect(page.locator('h2').first()).toContainText('Component Gallery');
    expect(page.url()).toContain('#/components');
  });

  test('navigates to Dashboard via nav link', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Dashboard');
    await expect(page.locator('h2').first()).toContainText('Economic Dashboard');
    expect(page.url()).toContain('#/dashboard');
  });

  test('navigates back to Home', async ({ page }) => {
    await page.goto('/#/components');
    await page.click('.nav-logo');
    await expect(page.locator('h1')).toContainText('LiquidJS');
  });

  test('direct URL with hash loads correct screen', async ({ page }) => {
    await page.goto('/#/dashboard');
    await expect(page.locator('h2').first()).toContainText('Economic Dashboard');
  });

  test('active nav link is highlighted', async ({ page }) => {
    await page.goto('/#/components');
    const activeLink = page.locator('.nav-link.active');
    await expect(activeLink).toContainText('Components');
  });
});
