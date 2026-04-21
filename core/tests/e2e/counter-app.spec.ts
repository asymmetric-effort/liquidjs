import { test, expect } from '@playwright/test';

test.describe('Counter App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/counter-app/');
    await page.waitForSelector('#counter-app');
  });

  test('renders initial state', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Step Counter');
    await expect(page.getByTestId('count')).toHaveText('0');
    await expect(page.getByTestId('is-even')).toHaveText('Even');
    await expect(page.getByTestId('double')).toHaveText('Double: 0');
  });

  test('increments counter', async ({ page }) => {
    await page.getByTestId('inc-btn').click();
    await expect(page.getByTestId('count')).toHaveText('1');
    await expect(page.getByTestId('is-even')).toHaveText('Odd');
    await expect(page.getByTestId('double')).toHaveText('Double: 2');
  });

  test('decrements counter', async ({ page }) => {
    await page.getByTestId('dec-btn').click();
    await expect(page.getByTestId('count')).toHaveText('-1');
  });

  test('resets counter', async ({ page }) => {
    await page.getByTestId('inc-btn').click();
    await expect(page.getByTestId('count')).toHaveText('1');

    await page.getByTestId('inc-btn').click();
    await expect(page.getByTestId('count')).toHaveText('2');

    await page.getByTestId('reset-btn').click();
    await expect(page.getByTestId('count')).toHaveText('0');
  });

  test('multiple clicks accumulate', async ({ page }) => {
    await page.getByTestId('inc-btn').click();
    await expect(page.getByTestId('count')).toHaveText('1');

    await page.getByTestId('inc-btn').click();
    await expect(page.getByTestId('count')).toHaveText('2');

    await page.getByTestId('inc-btn').click();
    await expect(page.getByTestId('count')).toHaveText('3');

    await expect(page.getByTestId('is-even')).toHaveText('Odd');
    await expect(page.getByTestId('double')).toHaveText('Double: 6');
  });

  test('tracks render count', async ({ page }) => {
    const renders = page.getByTestId('renders');
    await expect(renders).toContainText('Renders:');
  });

  test('counter shows positive/negative styling', async ({ page }) => {
    await page.getByTestId('inc-btn').click();
    await expect(page.getByTestId('count')).toHaveClass(/positive/);

    await page.getByTestId('reset-btn').click();
    await page.getByTestId('dec-btn').click();
    await expect(page.getByTestId('count')).toHaveClass(/negative/);
  });
});
