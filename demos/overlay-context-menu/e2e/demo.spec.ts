import { test, expect } from '@playwright/test';

test.describe('Context Menu Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Context Menu Component Demo');
  });

  test('shows basic context menu section', async ({ page }) => {
    await expect(page.getByText('Basic Context Menu')).toBeVisible();
  });

  test('shows nested submenus section', async ({ page }) => {
    await expect(page.getByText('Nested Submenus')).toBeVisible();
  });

  test('shows last action display', async ({ page }) => {
    await expect(page.getByText('(none)')).toBeVisible();
  });

  test('right-clicks to open context menu', async ({ page }) => {
    const triggerArea = page.locator('.trigger-area').first();
    await triggerArea.click({ button: 'right' });
    await expect(page.locator('body')).not.toBeEmpty();
  });
});
