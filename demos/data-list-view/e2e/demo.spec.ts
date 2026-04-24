import { test, expect } from '@playwright/test';

test.describe('ListView Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('ListView Demo');
  });

  test('shows filter input', async ({ page }) => {
    await expect(page.locator('input[placeholder="Filter contacts..."]')).toBeVisible();
  });

  test('shows toggle buttons', async ({ page }) => {
    await expect(page.getByText('Dividers')).toBeVisible();
    await expect(page.getByText('Hoverable')).toBeVisible();
    await expect(page.getByText('Header')).toBeVisible();
    await expect(page.getByText('Footer')).toBeVisible();
  });

  test('displays contact list items', async ({ page }) => {
    await expect(page.getByText('Alice Johnson')).toBeVisible();
    await expect(page.getByText('Bob Smith')).toBeVisible();
    await expect(page.getByText('Charlie Brown')).toBeVisible();
  });

  test('displays header with contact count', async ({ page }) => {
    await expect(page.getByText('Contacts (8)')).toBeVisible();
  });

  test('displays footer text', async ({ page }) => {
    await expect(page.getByText('End of contact list')).toBeVisible();
  });

  test('filters contacts when typing in filter input', async ({ page }) => {
    await page.locator('input[placeholder="Filter contacts..."]').fill('Alice');
    await expect(page.getByText('Alice Johnson')).toBeVisible();
    await expect(page.getByText('Bob Smith')).not.toBeVisible();
  });

  test('shows empty message when no contacts match filter', async ({ page }) => {
    await page.locator('input[placeholder="Filter contacts..."]').fill('zzzzz');
    await expect(page.getByText('No contacts match your filter')).toBeVisible();
  });

  test('toggles dividers off', async ({ page }) => {
    const dividersBtn = page.getByText('Dividers');
    await expect(dividersBtn).toHaveCSS('background-color', 'rgb(59, 130, 246)');
    await dividersBtn.click();
    await expect(dividersBtn).not.toHaveCSS('background-color', 'rgb(59, 130, 246)');
  });
});
