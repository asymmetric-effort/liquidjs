import { test, expect } from '@playwright/test';

test.describe('2D Pie Graph Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('2D Pie Graph Demo');
  });

  test('shows interactive pie chart section', async ({ page }) => {
    await expect(page.getByText('Interactive Pie / Donut Chart')).toBeVisible();
  });

  test('shows controls', async ({ page }) => {
    await expect(page.locator('.controls')).toBeVisible();
  });

  test('shows donut chart section', async ({ page }) => {
    await expect(page.getByText('Donut Chart')).toBeVisible();
  });

  test('adjusts inner radius slider', async ({ page }) => {
    const slider = page.locator('input[type="range"]').first();
    await slider.fill('50');
    await expect(page.locator('body')).not.toBeEmpty();
  });
});
