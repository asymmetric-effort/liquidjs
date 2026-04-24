import { test, expect } from '@playwright/test';

test.describe('API Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/api');
  });

  test('renders API heading', async ({ page }) => {
    await expect(page.locator('h2').first()).toContainText('API Integration');
  });

  test('displays demo cards', async ({ page }) => {
    const cards = page.locator('.preview-card');
    await expect(cards).toHaveCount(4);
  });

  test('useFetch demo loads and displays JSON data', async ({ page }) => {
    await expect(page.locator('.code-block').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.preview-body').first()).toContainText('realGdpGrowth');
  });

  test('REST client pattern shows code example', async ({ page }) => {
    await expect(page.locator('.preview-body').nth(1)).toContainText('createRestClient');
  });

  test('GraphQL pattern shows code example', async ({ page }) => {
    await expect(page.locator('.preview-body').nth(2)).toContainText('createGraphQLClient');
  });

  test('error handling demo switches between valid and invalid', async ({ page }) => {
    await expect(page.locator('.preview-body').last()).toContainText('successfully');
    await page.click('text=Invalid URL');
    await expect(page.locator('.preview-body').last()).toContainText('Error', { timeout: 5000 });
  });
});
