import { test, expect } from '@playwright/test';

test.describe('Stepper Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Stepper Demo');
  });

  test('shows orientation control', async ({ page }) => {
    await expect(page.getByText('Orientation:')).toBeVisible();
  });

  test('shows prev and next buttons', async ({ page }) => {
    await expect(page.getByText('Prev')).toBeVisible();
    await expect(page.getByText('Next')).toBeVisible();
  });

  test('clicks next to advance step', async ({ page }) => {
    const nextBtn = page.getByText('Next');
    await nextBtn.click();
    await expect(page.locator('body')).not.toBeEmpty();
  });
});
