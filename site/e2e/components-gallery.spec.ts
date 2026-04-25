import { test, expect } from '@playwright/test';

test.describe('Components Gallery', () => {
  test.beforeEach(async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/#/components');
    // Verify no JS errors on load
    expect(errors).toEqual([]);
  });

  test('renders gallery heading', async ({ page }) => {
    await expect(page.locator('.dialog-title')).toContainText('Component Gallery');
  });

  test('displays accordion sections', async ({ page }) => {
    const sections = page.locator('.dialog-body .accordion-section');
    await expect(sections).toHaveCount(6);
  });

  test('toggle component responds to clicks', async ({ page }) => {
    const toggle = page.locator('.dialog-body .demo-toggle').first();
    await expect(toggle).toContainText('Off');
    await toggle.click();
    await expect(toggle).toContainText('On');
  });

  test('text input captures typed text', async ({ page }) => {
    const body = page.locator('.dialog-body');
    const input = body.locator('.accordion-body input[type="text"]').first();
    await input.fill('hello');
    await expect(body).toContainText('hello');
  });

  test('visualization section renders SVG charts', async ({ page }) => {
    const body = page.locator('.dialog-body');
    // Click on Visualization accordion to open it
    await body.locator('.accordion-header:has-text("Visualization")').click();
    // Should see SVG elements from the chart demos
    await expect(body.locator('.accordion-body svg').first()).toBeVisible({ timeout: 5000 });
  });
});
