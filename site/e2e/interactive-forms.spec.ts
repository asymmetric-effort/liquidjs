import { test, expect } from '@playwright/test';

test.describe('Interactive Forms', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/forms');
  });

  test('renders forms heading', async ({ page }) => {
    await expect(page.locator('.dialog-title')).toContainText('Interactive Forms');
  });

  test('displays form preview cards', async ({ page }) => {
    const cards = page.locator('.dialog-body .preview-card');
    await expect(cards).toHaveCount(4);
  });

  test('sign up form validates empty fields', async ({ page }) => {
    const body = page.locator('.dialog-body');
    await body.locator('text=Sign Up').first().click();
    await expect(body.locator('.preview-body').first()).toContainText('required');
  });

  test('sign up form accepts valid input', async ({ page }) => {
    const firstCard = page.locator('.dialog-body .preview-body').first();
    await firstCard.locator('input').first().fill('Alice');
    await firstCard.locator('input').nth(1).fill('alice@example.com');
    await firstCard.locator('text=Sign Up').click();
    await expect(firstCard).toContainText('Welcome, Alice');
  });

  test('multi-step wizard navigates steps', async ({ page }) => {
    const body = page.locator('.dialog-body');
    await expect(body.locator('.preview-body')).toContainText('Step 1');
    await body.locator('text=Next').first().click();
    await expect(body.locator('.preview-body').last()).toContainText('Step 2');
  });
});
