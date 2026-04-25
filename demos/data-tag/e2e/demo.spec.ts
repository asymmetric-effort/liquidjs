import { test, expect } from '@playwright/test';

test.describe('Tag Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Tag Demo');
  });

  test('shows initial tags', async ({ page }) => {
    await expect(page.getByText('JavaScript')).toBeVisible();
    await expect(page.getByText('TypeScript')).toBeVisible();
    await expect(page.getByText('SpecifyJS')).toBeVisible();
    await expect(page.getByText('Rust')).toBeVisible();
  });

  test('shows control buttons', async ({ page }) => {
    await expect(page.getByText('Removable')).toBeVisible();
    await expect(page.getByText('Disabled')).toBeVisible();
    await expect(page.getByText('Reset')).toBeVisible();
  });

  test('shows add tag input and button', async ({ page }) => {
    await expect(page.locator('input[placeholder="Add a new tag..."]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
  });

  test('adds a new tag', async ({ page }) => {
    await page.locator('input[placeholder="Add a new tag..."]').fill('NewTag');
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText('NewTag')).toBeVisible();
  });

  test('shows click log when tag is clicked', async ({ page }) => {
    await page.getByText('JavaScript').click();
    await expect(page.getByText('Click Log:')).toBeVisible();
    await expect(page.getByText('Clicked: JavaScript')).toBeVisible();
  });

  test('toggles disabled state', async ({ page }) => {
    const disabledBtn = page.getByText('Disabled');
    await disabledBtn.click();
    await expect(disabledBtn).toHaveCSS('background-color', 'rgb(59, 130, 246)');
  });

  test('has variant selector', async ({ page }) => {
    const variantSelect = page.locator('select').first();
    await expect(variantSelect).toBeVisible();
    await variantSelect.selectOption('solid');
    await expect(variantSelect).toHaveValue('solid');
  });
});
