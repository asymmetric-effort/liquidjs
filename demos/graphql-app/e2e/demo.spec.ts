import { test, expect } from '@playwright/test';

test.describe('GraphQL App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the app', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('shows the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Contact Directory');
  });

  test('shows search bar', async ({ page }) => {
    await expect(page.locator('.search-bar')).toBeVisible();
  });

  test('shows add form', async ({ page }) => {
    await expect(page.locator('.add-form')).toBeVisible();
  });

  test('shows query inspector', async ({ page }) => {
    await expect(page.getByText('Last GraphQL Query')).toBeVisible();
  });

  test('types in search bar', async ({ page }) => {
    const input = page.locator('.search-bar');
    await input.fill('test');
    await expect(input).toHaveValue('test');
  });
});
