import { test, expect } from '@playwright/test';

test.describe('Avatar Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Avatar Demo');
  });

  test('shows size selector', async ({ page }) => {
    const sizeSelect = page.locator('select').first();
    await expect(sizeSelect).toBeVisible();
    await expect(sizeSelect).toContainText('MD (40px)');
  });

  test('shows shape toggle buttons', async ({ page }) => {
    await expect(page.getByText('Circle')).toBeVisible();
    await expect(page.getByText('Square')).toBeVisible();
  });

  test('displays initials fallback section', async ({ page }) => {
    await expect(page.getByText('Initials Fallback')).toBeVisible();
    await expect(page.getByText('Alice')).toBeVisible();
    await expect(page.getByText('Bob')).toBeVisible();
  });

  test('displays size comparison section', async ({ page }) => {
    await expect(page.getByText('Size Comparison')).toBeVisible();
  });

  test('displays status indicators section', async ({ page }) => {
    await expect(page.getByText('Status Indicators')).toBeVisible();
  });

  test('toggles shape to square when clicking Square button', async ({ page }) => {
    const squareBtn = page.getByText('Square');
    await squareBtn.click();
    await expect(squareBtn).toHaveCSS('background-color', 'rgb(59, 130, 246)');
  });

  test('changes size via dropdown', async ({ page }) => {
    const sizeSelect = page.locator('select').first();
    await sizeSelect.selectOption('lg');
    await expect(sizeSelect).toHaveValue('lg');
  });

  test('toggles status indicator visibility', async ({ page }) => {
    const statusBtn = page.getByText('Status', { exact: true });
    await statusBtn.click();
    // After clicking, status should toggle off
    await expect(statusBtn).not.toHaveCSS('background-color', 'rgb(59, 130, 246)');
  });
});
