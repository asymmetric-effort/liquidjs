import { test, expect } from '@playwright/test';

test.describe('Alert Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Alert Demo');
  });

  test('shows Reset All button', async ({ page }) => {
    await expect(page.getByText('Reset All')).toBeVisible();
  });

  test('shows alert types section', async ({ page }) => {
    await expect(page.getByText('Alert Types (Subtle)')).toBeVisible();
  });

  test('displays info alert', async ({ page }) => {
    await expect(page.getByText('This is an informational alert.')).toBeVisible();
  });

  test('displays success alert', async ({ page }) => {
    await expect(page.getByText('Operation completed successfully.')).toBeVisible();
  });

  test('displays warning alert', async ({ page }) => {
    await expect(page.getByText('Please review before continuing.')).toBeVisible();
  });

  test('displays error alert', async ({ page }) => {
    await expect(page.getByText('Something went wrong. Please try again.')).toBeVisible();
  });

  test('shows filled variant section', async ({ page }) => {
    await expect(page.getByText('Filled Variant')).toBeVisible();
    await expect(page.getByText('Filled info alert')).toBeVisible();
  });

  test('shows outline variant section', async ({ page }) => {
    await expect(page.getByText('Outline Variant')).toBeVisible();
    await expect(page.getByText('Outline info alert')).toBeVisible();
  });

  test('shows action button section', async ({ page }) => {
    await expect(page.getByText('With Action')).toBeVisible();
    await expect(page.getByText('Update Now')).toBeVisible();
  });

  test('clicks Reset All button', async ({ page }) => {
    const resetBtn = page.getByText('Reset All');
    await resetBtn.click();
    // After reset, all alerts should still be visible
    await expect(page.getByText('This is an informational alert.')).toBeVisible();
  });
});
