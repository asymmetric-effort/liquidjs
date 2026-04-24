import { test, expect } from '@playwright/test';

test.describe('EmptyState Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('EmptyState Demo');
  });

  test('shows basic empty state', async ({ page }) => {
    await expect(page.getByText('Basic Empty State')).toBeVisible();
    await expect(page.getByText('No messages')).toBeVisible();
    await expect(page.getByText('Your inbox is empty. New messages will appear here.')).toBeVisible();
  });

  test('shows empty state with action button', async ({ page }) => {
    await expect(page.getByText('With Action Button')).toBeVisible();
    await expect(page.getByText('No results found')).toBeVisible();
    await expect(page.getByText('Clear Filters')).toBeVisible();
  });

  test('shows empty state with image', async ({ page }) => {
    await expect(page.getByText('With Image')).toBeVisible();
    await expect(page.getByText('Something went wrong')).toBeVisible();
    await expect(page.getByText('Retry')).toBeVisible();
  });

  test('shows interactive toggle section', async ({ page }) => {
    await expect(page.getByText('Interactive Toggle')).toBeVisible();
    await expect(page.getByText('No items yet')).toBeVisible();
  });

  test('toggles items on and off', async ({ page }) => {
    const toggleBtn = page.getByText('Add items');
    await toggleBtn.click();
    await expect(page.getByText('Item 1')).toBeVisible();
    await expect(page.getByText('Item 2')).toBeVisible();
    await expect(page.getByText('Item 3')).toBeVisible();
    await expect(page.getByText('No items yet')).not.toBeVisible();

    await page.getByText('Clear items').click();
    await expect(page.getByText('No items yet')).toBeVisible();
  });
});
