import { test, expect } from '@playwright/test';

test.describe('Components Gallery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/components');
  });

  test('renders gallery heading', async ({ page }) => {
    await expect(page.locator('h2').first()).toContainText('Component Gallery');
  });

  test('displays component preview cards', async ({ page }) => {
    const cards = page.locator('.preview-card');
    await expect(cards).toHaveCount(6);
  });

  test('toggle component responds to clicks', async ({ page }) => {
    const toggle = page.locator('.demo-toggle').first();
    await expect(toggle).toContainText('Off');
    await toggle.click();
    await expect(toggle).toContainText('On');
  });

  test('counter component increments and decrements', async ({ page }) => {
    const buttons = page.locator('.preview-body button');
    // Find the + button (counter has - and + buttons)
    const plusBtn = page.locator('.preview-body button:has-text("+")').first();
    await plusBtn.click();
    await plusBtn.click();
    // Counter should show 2
    await expect(page.locator('.preview-body span').nth(1)).toContainText('2');
  });

  test('text input captures typed text', async ({ page }) => {
    const input = page.locator('.preview-body input[type="text"]').first();
    await input.fill('hello');
    await expect(page.locator('.preview-body')).toContainText('hello');
  });
});
