import { test, expect } from '@playwright/test';

test.describe('Protobuf App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the app', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('shows the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Task Tracker');
  });

  test('shows add form', async ({ page }) => {
    await expect(page.locator('.add-form')).toBeVisible();
  });

  test('shows add button', async ({ page }) => {
    await expect(page.locator('.add-btn')).toBeVisible();
  });

  test('shows raw binary wire data section', async ({ page }) => {
    await expect(page.getByText('Raw Binary Wire Data')).toBeVisible();
  });

  test('types in title input', async ({ page }) => {
    const input = page.locator('input').first();
    await input.fill('Test Task');
    await expect(input).toHaveValue('Test Task');
  });
});
