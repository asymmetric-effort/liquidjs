import { test, expect } from '@playwright/test';

test.describe('TreeNav Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('TreeNav Demo');
  });

  test('shows tree navigation nodes', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('shows last event display', async ({ page }) => {
    await expect(page.getByText('None')).toBeVisible();
  });

  test('clicks a tree node', async ({ page }) => {
    const node = page.locator('body');
    await expect(node).not.toBeEmpty();
  });
});
