import { test, expect } from '@playwright/test';

test.describe('ProgressBar Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('ProgressBar Demo');
  });

  test('shows interactive section', async ({ page }) => {
    await expect(page.getByText('Interactive')).toBeVisible();
  });

  test('shows initial value of 45%', async ({ page }) => {
    await expect(page.getByText('45%')).toBeVisible();
  });

  test('shows increment and decrement buttons', async ({ page }) => {
    await expect(page.getByText('-10')).toBeVisible();
    await expect(page.getByText('+10')).toBeVisible();
  });

  test('increments value by 10', async ({ page }) => {
    await page.getByText('+10').click();
    await expect(page.getByText('55%')).toBeVisible();
  });

  test('decrements value by 10', async ({ page }) => {
    await page.getByText('-10').click();
    await expect(page.getByText('35%')).toBeVisible();
  });

  test('shows bar variants section', async ({ page }) => {
    await expect(page.getByText('Bar Variants')).toBeVisible();
    await expect(page.getByText('25%').first()).toBeVisible();
  });

  test('shows circular variants section', async ({ page }) => {
    await expect(page.getByText('Circular Variants')).toBeVisible();
  });

  test('toggles animated checkbox', async ({ page }) => {
    const animatedCheckbox = page.locator('input[type="checkbox"]').first();
    await animatedCheckbox.check();
    await expect(animatedCheckbox).toBeChecked();
  });

  test('toggles indeterminate checkbox', async ({ page }) => {
    const indeterminateCheckbox = page.locator('input[type="checkbox"]').nth(1);
    await indeterminateCheckbox.check();
    await expect(indeterminateCheckbox).toBeChecked();
  });
});
