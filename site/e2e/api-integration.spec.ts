import { test, expect } from '@playwright/test';

test.describe('API Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/api');
  });

  test('renders API heading', async ({ page }) => {
    await expect(page.locator('.dialog-title')).toContainText('API Integration');
  });

  test('displays demo cards', async ({ page }) => {
    const cards = page.locator('.dialog-body .preview-card');
    await expect(cards).toHaveCount(4);
  });

  test('useFetch demo loads and displays JSON data', async ({ page }) => {
    const body = page.locator('.dialog-body');
    await expect(body.locator('.code-block').first()).toBeVisible({ timeout: 5000 });
    await expect(body.locator('.preview-body').first()).toContainText('realGdpGrowth');
  });

  test('REST client pattern shows code example', async ({ page }) => {
    await expect(page.locator('.dialog-body .preview-body').nth(1)).toContainText('createRestClient');
  });

  test('GraphQL pattern shows code example', async ({ page }) => {
    await expect(page.locator('.dialog-body .preview-body').nth(2)).toContainText('createGraphQLClient');
  });

  test('error handling demo switches between valid and invalid', async ({ page }) => {
    const body = page.locator('.dialog-body');
    await expect(body.locator('.preview-body').last()).toContainText('successfully');
    await body.locator('text=Invalid URL').first().click();
    await expect(body.locator('.preview-body').last()).toContainText('Error', { timeout: 5000 });
  });
});
