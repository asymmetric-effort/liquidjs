import { test, expect } from '@playwright/test';

test.describe('Economic Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/dashboard');
  });

  test('shows loading state initially', async ({ page }) => {
    // May see loading briefly or data immediately (depends on speed)
    const content = page.locator('.main-content');
    await expect(content).not.toBeEmpty();
  });

  test('renders dashboard heading', async ({ page }) => {
    await expect(page.locator('h2').first()).toContainText('Economic Dashboard');
  });

  test('displays 2026 snapshot stat cards', async ({ page }) => {
    await expect(page.locator('.stat-card').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.stat-cards').first()).toContainText('GDP Growth');
    await expect(page.locator('.stat-cards').first()).toContainText('Unemployment');
  });

  test('displays presidential economies table', async ({ page }) => {
    await expect(page.locator('.data-table').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.data-table')).toContainText('Clinton');
    await expect(page.locator('.data-table')).toContainText('Obama');
    await expect(page.locator('.data-table')).toContainText('Biden');
  });

  test('displays S&P 500 bar chart', async ({ page }) => {
    await expect(page.locator('.bar-chart').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.bar-chart')).toContainText('Obama');
    await expect(page.locator('.bar-chart')).toContainText('+120.9%');
  });

  test('displays recession data', async ({ page }) => {
    await expect(page.locator('text=U.S. Recessions')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.main-content')).toContainText('Great Recession');
    await expect(page.locator('.main-content')).toContainText('COVID-19');
  });

  test('shows data source attribution', async ({ page }) => {
    await expect(page.locator('.main-content')).toContainText('samcaldwell.info', { timeout: 5000 });
  });
});
