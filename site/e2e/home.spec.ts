import { test, expect } from '@playwright/test';

test.describe('Home Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders hero section', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('LiquidJS');
    await expect(page.locator('.hero p').first()).toContainText('TypeScript UI framework');
  });

  test('displays framework stats', async ({ page }) => {
    await expect(page.locator('.hero-stat-value').first()).toBeVisible();
    await expect(page.locator('.hero-stats')).toContainText('4KB');
    await expect(page.locator('.hero-stats')).toContainText('Dependencies');
  });

  test('displays feature cards', async ({ page }) => {
    const cards = page.locator('.feature-card');
    await expect(cards).toHaveCount(8);
    await expect(cards.first()).toContainText('Concurrent Rendering');
  });

  test('feature card opens article dialog', async ({ page }) => {
    await page.locator('.feature-card').first().click();
    await expect(page.locator('.dialog-title')).toBeVisible();
    await expect(page.locator('.article-section').first()).toBeVisible();
  });
});
