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
    const firstCard = page.locator('.dialog-body .preview-body').first();
    await firstCard.locator('button:has-text("Sign Up")').click();
    await expect(firstCard).toContainText('required');
  });

  test('multi-step wizard navigates steps', async ({ page }) => {
    const wizard = page.locator('.dialog-body .preview-body').last();
    await expect(wizard).toContainText('Step 1');
    await wizard.locator('button:has-text("Next")').click();
    await expect(wizard).toContainText('Step 2');
  });
});
