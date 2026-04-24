import { test, expect } from '@playwright/test';

test.describe('VizWrapper Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('VizWrapper Demo');
  });

  test('shows interactive layout section', async ({ page }) => {
    await expect(page.getByText('Interactive Layout')).toBeVisible();
  });

  test('shows controls', async ({ page }) => {
    await expect(page.locator('.controls')).toBeVisible();
  });

  test('shows styled wrapper section', async ({ page }) => {
    await expect(page.getByText('Styled Wrapper')).toBeVisible();
  });

  test('changes title position', async ({ page }) => {
    const select = page.locator('select').first();
    await select.selectOption('bottom');
    await expect(select).toHaveValue('bottom');
  });
});
