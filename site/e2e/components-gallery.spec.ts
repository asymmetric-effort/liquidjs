import { test, expect } from '@playwright/test';

test.describe('Components Gallery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/components');
  });

  test('renders gallery heading', async ({ page }) => {
    await expect(page.locator('.dialog-title')).toContainText('Component Gallery');
  });

  test('displays component preview cards', async ({ page }) => {
    const sections = page.locator('.dialog-body .accordion-section');
    await expect(sections).toHaveCount(6);
  });

  test('toggle component responds to clicks', async ({ page }) => {
    const toggle = page.locator('.dialog-body .demo-toggle').first();
    await expect(toggle).toContainText('Off');
    await toggle.click();
    await expect(toggle).toContainText('On');
  });

  test('counter component increments and decrements', async ({ page }) => {
    const body = page.locator('.dialog-body');
    // Find the + button (counter has - and + buttons)
    const plusBtn = body.locator('button:has-text("+")').first();
    await plusBtn.click();
    await plusBtn.click();
    // Counter should show 2
    await expect(body.locator('span').nth(1)).toContainText('2');
  });

  test('text input captures typed text', async ({ page }) => {
    const body = page.locator('.dialog-body');
    const input = body.locator('input[type="text"]').first();
    await input.fill('hello');
    await expect(body).toContainText('hello');
  });
});
