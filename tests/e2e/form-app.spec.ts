import { test, expect } from '@playwright/test';

test.describe('Form App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/form-app/');
    await page.waitForSelector('#form-app');
  });

  test('renders the form', async ({ page }) => {
    await expect(page.locator('h2')).toHaveText('Contact Us');
    await expect(page.getByTestId('name-input')).toBeVisible();
    await expect(page.getByTestId('email-input')).toBeVisible();
    await expect(page.getByTestId('message-input')).toBeVisible();
    await expect(page.getByTestId('submit-btn')).toBeVisible();
  });

  test('shows validation errors on empty submit', async ({ page }) => {
    await page.getByTestId('submit-btn').click();

    await expect(page.getByTestId('name-error')).toHaveText('Name is required');
    await expect(page.getByTestId('email-error')).toHaveText('Email is required');
    await expect(page.getByTestId('message-error')).toHaveText('Message is required');
  });

  test('validates email format', async ({ page }) => {
    await page.getByTestId('name-input').fill('John');
    await page.getByTestId('email-input').fill('not-an-email');
    await page.getByTestId('message-input').fill('Hello world, this is a test message');

    // Wait for form state to settle after fills
    await page.waitForTimeout(100);

    await page.getByTestId('submit-btn').click();

    await expect(page.getByTestId('email-error')).toHaveText('Invalid email');
  });

  test('validates message length', async ({ page }) => {
    await page.getByTestId('name-input').fill('John');
    await page.getByTestId('email-input').fill('john@test.com');
    await page.getByTestId('message-input').fill('Short');
    await page.getByTestId('submit-btn').click();

    await expect(page.getByTestId('message-error')).toHaveText('Message must be at least 10 characters');
  });

  test('submits valid form and shows success', async ({ page }) => {
    await page.getByTestId('name-input').fill('Jane Doe');
    await page.getByTestId('email-input').fill('jane@example.com');
    await page.getByTestId('message-input').fill('This is a valid message with enough characters');
    await page.getByTestId('submit-btn').click();

    await expect(page.getByTestId('success-message')).toBeVisible();
    await expect(page.getByTestId('success-message')).toContainText('Thank you');
    await expect(page.getByTestId('success-message')).toContainText('Jane Doe');
  });

  test('resets form after submission', async ({ page }) => {
    await page.getByTestId('name-input').fill('Jane Doe');
    await page.getByTestId('email-input').fill('jane@example.com');
    await page.getByTestId('message-input').fill('This is a valid message with enough characters');
    await page.getByTestId('submit-btn').click();

    await page.getByTestId('reset-form').click();

    await expect(page.getByTestId('contact-form')).toBeVisible();
    await expect(page.getByTestId('name-input')).toHaveValue('');
  });

  test('shows validity status', async ({ page }) => {
    await expect(page.getByTestId('validity')).toHaveText('Form has errors');

    await page.getByTestId('name-input').fill('John');
    await page.getByTestId('email-input').fill('john@test.com');
    await page.getByTestId('message-input').fill('A sufficiently long message');

    await expect(page.getByTestId('validity')).toHaveText('Form is valid');
  });

  test('theme toggle works', async ({ page }) => {
    const toggle = page.getByTestId('theme-toggle');
    await expect(toggle).toContainText('Switch to Dark');

    await toggle.click();
    await expect(toggle).toContainText('Switch to Light');
  });

  test('reset button clears form', async ({ page }) => {
    await page.getByTestId('name-input').fill('Test');
    await page.getByTestId('form-reset').click();
    await expect(page.getByTestId('name-input')).toHaveValue('');
  });

  test('clears field errors when typing', async ({ page }) => {
    // Trigger errors
    await page.getByTestId('submit-btn').click();
    await expect(page.getByTestId('name-error')).toBeVisible();

    // Type in the name field
    await page.getByTestId('name-input').fill('Something');
    // Error for name should be cleared
    await expect(page.getByTestId('name-error')).not.toBeVisible();
  });
});
