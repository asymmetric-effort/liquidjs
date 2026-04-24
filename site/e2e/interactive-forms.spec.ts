import { test, expect } from '@playwright/test';

test.describe('Interactive Forms', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/forms');
  });

  test('renders forms heading', async ({ page }) => {
    await expect(page.locator('h2').first()).toContainText('Interactive Forms');
  });

  test('displays form preview cards', async ({ page }) => {
    const cards = page.locator('.preview-card');
    await expect(cards).toHaveCount(4);
  });

  test('sign up form validates empty fields', async ({ page }) => {
    await page.click('text=Sign Up');
    await expect(page.locator('.preview-body').first()).toContainText('required');
  });

  test('sign up form accepts valid input', async ({ page }) => {
    const firstCard = page.locator('.preview-body').first();
    await firstCard.locator('input').first().fill('Alice');
    await firstCard.locator('input').nth(1).fill('alice@example.com');
    await firstCard.locator('text=Sign Up').click();
    await expect(firstCard).toContainText('Welcome, Alice');
  });

  test('multi-step wizard navigates steps', async ({ page }) => {
    await expect(page.locator('.preview-body')).toContainText('Step 1');
    await page.click('text=Next');
    await expect(page.locator('.preview-body').last()).toContainText('Step 2');
  });
});
