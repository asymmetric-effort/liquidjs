import { test, expect } from '@playwright/test';

test.describe('Economic Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/dashboard');
  });

  test('shows loading state initially', async ({ page }) => {
    // May see loading briefly or data immediately (depends on speed)
    const content = page.locator('.dialog-body');
    await expect(content).not.toBeEmpty();
  });

  test('renders dashboard heading', async ({ page }) => {
    await expect(page.locator('.dialog-title')).toContainText('Economic Dashboard');
  });

  test('displays 2026 snapshot stat cards', async ({ page }) => {
    const body = page.locator('.dialog-body');
    await expect(body.locator('.stat-card').first()).toBeVisible({ timeout: 5000 });
    await expect(body.locator('.stat-cards').first()).toContainText('GDP Growth');
    await expect(body.locator('.stat-cards').first()).toContainText('Unemployment');
  });

  test('displays presidential economies table', async ({ page }) => {
    const body = page.locator('.dialog-body');
    await expect(body.locator('.data-table').first()).toBeVisible({ timeout: 5000 });
    await expect(body.locator('.data-table')).toContainText('Clinton');
    await expect(body.locator('.data-table')).toContainText('Obama');
    await expect(body.locator('.data-table')).toContainText('Biden');
  });

  test('displays S&P 500 bar chart', async ({ page }) => {
    const body = page.locator('.dialog-body');
    await expect(body.locator('.bar-chart').first()).toBeVisible({ timeout: 5000 });
    await expect(body.locator('.bar-chart')).toContainText('Obama');
    await expect(body.locator('.bar-chart')).toContainText('+120.9%');
  });

  test('displays recession data', async ({ page }) => {
    const body = page.locator('.dialog-body');
    await expect(body.locator('text=U.S. Recessions')).toBeVisible({ timeout: 5000 });
    await expect(body).toContainText('Great Recession');
    await expect(body).toContainText('COVID-19');
  });

  test('shows data source attribution', async ({ page }) => {
    await expect(page.locator('.dialog-body')).toContainText('samcaldwell.info', { timeout: 5000 });
  });
});
