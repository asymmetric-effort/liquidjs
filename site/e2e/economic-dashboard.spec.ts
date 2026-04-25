import { test, expect } from '@playwright/test';

test.describe('Economic Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/dashboard');
  });

  test('renders dashboard heading', async ({ page }) => {
    await expect(page.locator('.dialog-title')).toContainText('Economic Dashboard');
  });

  test('displays 2026 snapshot stat cards', async ({ page }) => {
    const body = page.locator('.dialog-body');
    await expect(body.locator('.stat-card').first()).toBeVisible({ timeout: 5000 });
    await expect(body.locator('.stat-cards').first()).toContainText('GDP Growth');
  });

  test('displays S&P 500 SVG bar chart with data', async ({ page }) => {
    const body = page.locator('.dialog-body');
    // SVG bar chart should render with rect elements for bars
    await expect(body.locator('svg rect').first()).toBeVisible({ timeout: 5000 });
    // Should show president names as text labels
    await expect(body.locator('svg')).toContainText('Obama');
  });

  test('displays GDP line chart', async ({ page }) => {
    const body = page.locator('.dialog-body');
    // Line chart uses SVG path and circles
    await expect(body.locator('svg path').first()).toBeVisible({ timeout: 5000 });
    await expect(body.locator('svg circle').first()).toBeVisible({ timeout: 5000 });
  });

  test('displays CPI box plot', async ({ page }) => {
    const body = page.locator('.dialog-body');
    // Box plot has whisker lines and a box rect
    await expect(body).toContainText('Median');
    await expect(body).toContainText('CPI %');
  });

  test('displays presidential economies table', async ({ page }) => {
    const body = page.locator('.dialog-body');
    await expect(body.locator('.data-table').first()).toBeVisible({ timeout: 5000 });
    await expect(body.locator('.data-table')).toContainText('Clinton');
    await expect(body.locator('.data-table')).toContainText('Biden');
  });

  test('displays recession data', async ({ page }) => {
    const body = page.locator('.dialog-body');
    await expect(body).toContainText('Great Recession', { timeout: 5000 });
    await expect(body).toContainText('COVID-19');
  });

  test('shows data source attribution', async ({ page }) => {
    await expect(page.locator('.dialog-body')).toContainText('samcaldwell.info', { timeout: 5000 });
  });
});
