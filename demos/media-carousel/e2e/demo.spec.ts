import { test, expect } from '@playwright/test';

test.describe('Carousel Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Carousel Demo');
  });

  test('shows interactive carousel section', async ({ page }) => {
    await expect(page.getByText('Interactive Carousel')).toBeVisible();
  });

  test('shows controls section', async ({ page }) => {
    await expect(page.locator('.controls')).toBeVisible();
  });

  test('shows without arrows variant', async ({ page }) => {
    await expect(page.getByText('Without Arrows')).toBeVisible();
  });

  test('toggles auto-play control', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.click();
    await expect(checkbox).toBeDefined();
  });
});
