import { test, expect } from '@playwright/test';

test.describe('Popover Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Popover Component Demo');
  });

  test('shows basic popover section', async ({ page }) => {
    await expect(page.getByText('Basic Popover (Uncontrolled)')).toBeVisible();
  });

  test('shows controlled popover section', async ({ page }) => {
    await expect(page.getByText('Controlled Popover')).toBeVisible();
  });

  test('shows placement variants section', async ({ page }) => {
    await expect(page.getByText('Placement Variants')).toBeVisible();
  });

  test('clicks popover trigger button', async ({ page }) => {
    const btn = page.locator('.btn').first();
    await btn.click();
    await expect(page.locator('body')).not.toBeEmpty();
  });
});
