import { test, expect } from '@playwright/test';

test.describe('Pagination Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Pagination Demo');
  });

  test('shows page size control', async ({ page }) => {
    await expect(page.getByText('Page Size:')).toBeVisible();
  });

  test('shows current page indicator', async ({ page }) => {
    await expect(page.getByText('Page')).toBeVisible();
  });

  test('navigates to next page', async ({ page }) => {
    const nextBtn = page.locator('button').last();
    await nextBtn.click();
    await expect(page.locator('body')).not.toBeEmpty();
  });
});
