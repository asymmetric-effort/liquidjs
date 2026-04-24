import { test, expect } from '@playwright/test';

test.describe('VirtualScroll Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('VirtualScroll Demo');
  });

  test('shows item count description', async ({ page }) => {
    await expect(page.getByText(/10,000 log entries/)).toBeVisible();
  });

  test('shows control dropdowns', async ({ page }) => {
    await expect(page.getByText('Items:')).toBeVisible();
    await expect(page.getByText('Row height:')).toBeVisible();
    await expect(page.getByText('Height:')).toBeVisible();
    await expect(page.getByText('Overscan:')).toBeVisible();
  });

  test('renders log entries with timestamps', async ({ page }) => {
    await expect(page.getByText(/2026-04-21/).first()).toBeVisible();
  });

  test('renders log levels', async ({ page }) => {
    await expect(page.getByText('INFO').first()).toBeVisible();
  });

  test('changes item count via dropdown', async ({ page }) => {
    const itemsSelect = page.locator('select').first();
    await itemsSelect.selectOption('1000');
    await expect(page.getByText(/1,000 log entries/)).toBeVisible();
  });

  test('changes row height via dropdown', async ({ page }) => {
    const heightSelect = page.locator('select').nth(1);
    await heightSelect.selectOption('36');
    await expect(heightSelect).toHaveValue('36');
  });

  test('only renders a subset of items in the DOM', async ({ page }) => {
    // Virtual scroll should not render all 10,000 items
    const renderedItems = await page.locator('[style*="position"]').count();
    expect(renderedItems).toBeLessThan(100);
  });
});
