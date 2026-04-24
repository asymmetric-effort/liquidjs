import { test, expect } from '@playwright/test';

test.describe('Badge Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Badge Demo');
  });

  test('shows increment and decrement buttons', async ({ page }) => {
    await expect(page.getByText('+ 1')).toBeVisible();
    await expect(page.getByText('- 1')).toBeVisible();
    await expect(page.getByText('Reset')).toBeVisible();
  });

  test('displays initial count of 5', async ({ page }) => {
    await expect(page.locator('span').filter({ hasText: /^5$/ })).toBeVisible();
  });

  test('increments count when clicking + 1', async ({ page }) => {
    await page.getByText('+ 1').click();
    await expect(page.locator('span').filter({ hasText: /^6$/ })).toBeVisible();
  });

  test('decrements count when clicking - 1', async ({ page }) => {
    await page.getByText('- 1').click();
    await expect(page.locator('span').filter({ hasText: /^4$/ })).toBeVisible();
  });

  test('resets count to 0', async ({ page }) => {
    await page.getByText('Reset').click();
    await expect(page.locator('span').filter({ hasText: /^0$/ })).toBeVisible();
  });

  test('shows overlay badges section', async ({ page }) => {
    await expect(page.getByText('Overlay Badges')).toBeVisible();
  });

  test('shows inline badges section', async ({ page }) => {
    await expect(page.getByText('Inline Badges')).toBeVisible();
  });

  test('toggles dot mode', async ({ page }) => {
    const dotBtn = page.getByText('Dot mode');
    await dotBtn.click();
    await expect(dotBtn).toHaveCSS('background-color', 'rgb(59, 130, 246)');
  });

  test('shows color presets section', async ({ page }) => {
    await expect(page.getByText('Color Presets')).toBeVisible();
  });
});
