import { test, expect } from '@playwright/test';

test.describe('Hypercube Graph Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Hypercube Graph Demo');
  });

  test('shows interactive hypercube section', async ({ page }) => {
    await expect(page.getByText('Interactive Hypercube')).toBeVisible();
  });

  test('shows controls', async ({ page }) => {
    await expect(page.locator('.controls')).toBeVisible();
  });

  test('shows custom styling section', async ({ page }) => {
    await expect(page.getByText('Custom Styling')).toBeVisible();
  });

  test('changes dimension control', async ({ page }) => {
    const input = page.locator('input[type="range"]').first();
    await input.fill('5');
    await expect(page.locator('body')).not.toBeEmpty();
  });
});
