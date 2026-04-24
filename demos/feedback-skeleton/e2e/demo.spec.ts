import { test, expect } from '@playwright/test';

test.describe('Skeleton Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Skeleton Demo');
  });

  test('shows controls section', async ({ page }) => {
    await expect(page.getByText('Controls')).toBeVisible();
  });

  test('shows animated checkbox', async ({ page }) => {
    const animatedCheckbox = page.locator('input[type="checkbox"]');
    await expect(animatedCheckbox).toBeVisible();
    await expect(animatedCheckbox).toBeChecked();
  });

  test('shows text skeleton section', async ({ page }) => {
    await expect(page.getByText('Text Skeleton')).toBeVisible();
  });

  test('shows circular skeleton section', async ({ page }) => {
    await expect(page.getByText('Circular Skeleton')).toBeVisible();
  });

  test('shows rectangular skeleton section', async ({ page }) => {
    await expect(page.getByText('Rectangular Skeleton')).toBeVisible();
  });

  test('shows card loading pattern section', async ({ page }) => {
    await expect(page.getByText('Card Loading Pattern')).toBeVisible();
  });

  test('toggles animated checkbox off', async ({ page }) => {
    const animatedCheckbox = page.locator('input[type="checkbox"]');
    await animatedCheckbox.uncheck();
    await expect(animatedCheckbox).not.toBeChecked();
  });
});
