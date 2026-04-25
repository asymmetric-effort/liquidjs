import { test, expect } from '@playwright/test';

test.describe('Todo App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the app', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('shows the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('SpecifyJS Todo');
  });

  test('shows todo input', async ({ page }) => {
    await expect(page.locator('input')).toBeVisible();
  });

  test('shows delete buttons for existing todos', async ({ page }) => {
    await expect(page.locator('.delete-btn').first()).toBeVisible();
  });

  test('adds a new todo item', async ({ page }) => {
    const input = page.locator('input').first();
    await input.fill('Test todo item');
    await input.press('Enter');
    await expect(page.getByText('Test todo item')).toBeVisible();
  });
});
