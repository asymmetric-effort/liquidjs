import { test, expect } from '@playwright/test';

test.describe('Concurrent Rendering Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/concurrent');
  });

  test('renders concurrent heading', async ({ page }) => {
    await expect(page.locator('h2').first()).toContainText('Concurrent Rendering');
  });

  test('displays demo cards', async ({ page }) => {
    const cards = page.locator('.preview-card');
    await expect(cards).toHaveCount(4);
  });

  test('deferred filter list filters items', async ({ page }) => {
    const input = page.locator('.preview-body input').first();
    await input.fill('Alpha');
    await expect(page.locator('.preview-body').first()).toContainText('Alpha');
  });

  test('batched updates increments both values', async ({ page }) => {
    await page.click('text=Increment Both');
    await expect(page.locator('.preview-body').nth(2)).toContainText('1');
  });

  test('lane priority visualization shows all lanes', async ({ page }) => {
    await expect(page.locator('.preview-body').last()).toContainText('SyncLane');
    await expect(page.locator('.preview-body').last()).toContainText('DefaultLane');
    await expect(page.locator('.preview-body').last()).toContainText('TransitionLane');
    await expect(page.locator('.preview-body').last()).toContainText('IdleLane');
  });
});
