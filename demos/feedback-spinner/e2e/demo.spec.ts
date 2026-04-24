import { test, expect } from '@playwright/test';

test.describe('Spinner Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('renders the demo', async ({ page }) => {
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('displays the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Spinner Demo');
  });

  test('shows sizes section', async ({ page }) => {
    await expect(page.getByText('Sizes')).toBeVisible();
  });

  test('shows colors section', async ({ page }) => {
    await expect(page.getByText('Colors')).toBeVisible();
  });

  test('shows speeds section', async ({ page }) => {
    await expect(page.getByText('Speeds')).toBeVisible();
  });

  test('shows speed buttons', async ({ page }) => {
    await expect(page.getByText('slow')).toBeVisible();
    await expect(page.getByText('normal')).toBeVisible();
    await expect(page.getByText('fast')).toBeVisible();
  });

  test('shows custom thickness section', async ({ page }) => {
    await expect(page.getByText('Custom Thickness')).toBeVisible();
  });

  test('changes speed when clicking speed button', async ({ page }) => {
    const slowBtn = page.getByText('slow');
    await slowBtn.click();
    await expect(slowBtn).toHaveCSS('font-weight', '700');
  });

  test('fast button updates style when clicked', async ({ page }) => {
    const fastBtn = page.getByText('fast');
    await fastBtn.click();
    await expect(fastBtn).toHaveCSS('font-weight', '700');
  });
});
