import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('loads home page without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('LiquidJS');
    expect(errors).toEqual([]);
  });

  test('navigates to Components via nav link', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await page.click('.nav-links >> text=Components');
    await expect(page.locator('h2').first()).toContainText('Component Gallery');
    expect(page.url()).toContain('#/components');
    expect(errors).toEqual([]);
  });

  test('navigates to Forms via nav link', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await page.click('.nav-links >> text=Forms');
    await expect(page.locator('h2').first()).toContainText('Interactive Forms');
    expect(page.url()).toContain('#/forms');
    expect(errors).toEqual([]);
  });

  test('navigates to Dashboard via nav link', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await page.click('.nav-links >> text=Dashboard');
    await expect(page.locator('h2').first()).toContainText('Economic Dashboard');
    expect(page.url()).toContain('#/dashboard');
    expect(errors).toEqual([]);
  });

  test('navigates to Concurrent via nav link', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await page.click('.nav-links >> text=Concurrent');
    await expect(page.locator('h2').first()).toContainText('Concurrent Rendering');
    expect(page.url()).toContain('#/concurrent');
    expect(errors).toEqual([]);
  });

  test('navigates to API via nav link', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await page.click('.nav-links >> text=API');
    await expect(page.locator('h2').first()).toContainText('API Integration');
    expect(page.url()).toContain('#/api');
    expect(errors).toEqual([]);
  });

  test('navigates to Reference via nav link', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await page.click('.nav-links >> text=Reference');
    await expect(page.locator('h2').first()).toContainText('Component Reference');
    expect(page.url()).toContain('#/reference');
    expect(errors).toEqual([]);
  });

  test('navigates back to Home via logo', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/#/components');
    await page.click('.nav-logo');
    await expect(page.locator('h1')).toContainText('LiquidJS');
    expect(errors).toEqual([]);
  });

  test('direct URL with hash loads correct screen', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/#/reference');
    await expect(page.locator('h2').first()).toContainText('Component Reference');
    expect(errors).toEqual([]);
  });

  test('active nav link is highlighted', async ({ page }) => {
    await page.goto('/#/forms');
    const activeLink = page.locator('.nav-link.active');
    await expect(activeLink).toContainText('Forms');
  });

  test('all nav links are visible', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('.nav-links .nav-link');
    await expect(links).toHaveCount(7);
  });
});
