import { test, expect } from '@playwright/test';

test.describe('Concurrent Rendering Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/concurrent');
  });

  test('renders concurrent heading', async ({ page }) => {
    await expect(page.locator('.dialog-title')).toContainText('Concurrent Rendering');
  });

  test('displays demo cards', async ({ page }) => {
    const cards = page.locator('.dialog-body .preview-card');
    await expect(cards).toHaveCount(4);
  });

  test('deferred filter list filters items', async ({ page }) => {
    const body = page.locator('.dialog-body');
    const input = body.locator('.preview-body input').first();
    await input.fill('Alpha');
    await expect(body.locator('.preview-body').first()).toContainText('Alpha');
  });

  test('batched updates increments both values', async ({ page }) => {
    const body = page.locator('.dialog-body');
    await body.locator('text=Increment Both').first().click();
    await expect(body.locator('.preview-body').nth(2)).toContainText('1');
  });

  test('lane priority visualization shows all lanes', async ({ page }) => {
    const body = page.locator('.dialog-body');
    await expect(body.locator('.preview-body').last()).toContainText('SyncLane');
    await expect(body.locator('.preview-body').last()).toContainText('DefaultLane');
    await expect(body.locator('.preview-body').last()).toContainText('TransitionLane');
    await expect(body.locator('.preview-body').last()).toContainText('IdleLane');
  });
});
