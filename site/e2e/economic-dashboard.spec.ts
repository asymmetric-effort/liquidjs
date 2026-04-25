import { test, expect } from '@playwright/test';

test.describe('Economic Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/dashboard');
    // Wait for data to load — stat cards appear after fetch completes
    await expect(page.locator('.dialog-body .stat-card').first()).toBeVisible({
      timeout: 10000,
    });
  });

  test('renders dashboard heading', async ({ page }) => {
    await expect(page.locator('.dialog-title')).toContainText('Economic Dashboard');
  });

  test('displays 2026 snapshot stat cards', async ({ page }) => {
    const body = page.locator('.dialog-body');
    await expect(body.locator('.stat-cards').first()).toContainText('GDP Growth');
  });

  test('displays S&P 500 SVG bar chart with data', async ({ page }) => {
    const body = page.locator('.dialog-body');
    await expect(body.locator('svg rect').first()).toBeVisible({ timeout: 10000 });
    await expect(body.locator('svg').first()).toContainText('Obama');
  });

  test('displays GDP line chart', async ({ page }) => {
    const body = page.locator('.dialog-body');
    await expect(body.locator('svg path').first()).toBeVisible({ timeout: 10000 });
    await expect(body.locator('svg circle').first()).toBeVisible();
  });

  test('displays CPI box plot', async ({ page }) => {
    const body = page.locator('.dialog-body');
    await expect(body).toContainText('Median', { timeout: 10000 });
    await expect(body).toContainText('CPI %');
  });

  test('displays presidential economies table', async ({ page }) => {
    const body = page.locator('.dialog-body');
    await expect(body.locator('.data-table')).toContainText('Clinton');
    await expect(body.locator('.data-table')).toContainText('Biden');
  });

  test('shows data source attribution', async ({ page }) => {
    await expect(page.locator('.dialog-body')).toContainText('samcaldwell.info');
  });
});
