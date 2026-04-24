import { test, expect } from '@playwright/test';

test.describe('DataGrid Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('DataGrid Demo');
  });

  test('shows control toggle buttons', async ({ page }) => {
    await expect(page.getByText('Striped')).toBeVisible();
    await expect(page.getByText('Bordered')).toBeVisible();
    await expect(page.getByText('Compact')).toBeVisible();
    await expect(page.getByText('Selectable')).toBeVisible();
  });

  test('displays table column headers', async ({ page }) => {
    await expect(page.getByText('Name')).toBeVisible();
    await expect(page.getByText('Department')).toBeVisible();
    await expect(page.getByText('Salary')).toBeVisible();
    await expect(page.getByText('Location')).toBeVisible();
  });

  test('displays employee data', async ({ page }) => {
    await expect(page.getByText('Alice Johnson')).toBeVisible();
    await expect(page.getByText('Engineering').first()).toBeVisible();
  });

  test('has page size selector', async ({ page }) => {
    const pageSizeSelect = page.locator('select').last();
    await expect(pageSizeSelect).toBeVisible();
  });

  test('toggles striped mode', async ({ page }) => {
    const stripedBtn = page.getByText('Striped');
    // Striped is active by default
    await expect(stripedBtn).toHaveCSS('background-color', 'rgb(59, 130, 246)');
    await stripedBtn.click();
    await expect(stripedBtn).not.toHaveCSS('background-color', 'rgb(59, 130, 246)');
  });

  test('toggles bordered mode', async ({ page }) => {
    const borderedBtn = page.getByText('Bordered');
    await borderedBtn.click();
    await expect(borderedBtn).toHaveCSS('background-color', 'rgb(59, 130, 246)');
  });
});
