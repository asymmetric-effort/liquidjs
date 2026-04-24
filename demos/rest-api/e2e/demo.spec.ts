import { test, expect } from '@playwright/test';

test.describe('REST API App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the app', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('shows the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('REST API Bookmarks');
  });

  test('shows add form', async ({ page }) => {
    await expect(page.locator('.add-form')).toBeVisible();
  });

  test('shows add bookmark button', async ({ page }) => {
    await expect(page.locator('.add-btn')).toBeVisible();
  });

  test('shows bookmark list', async ({ page }) => {
    await expect(page.locator('.bookmark-list')).toBeVisible();
  });

  test('types in url input', async ({ page }) => {
    const input = page.locator('input').first();
    await input.fill('https://example.com');
    await expect(input).toHaveValue('https://example.com');
  });
});
