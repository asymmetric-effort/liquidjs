import { test, expect } from '@playwright/test';

test.describe('Todo App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/todo-app/');
    await page.waitForSelector('#todo-app');
  });

  test('renders the app with empty state', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Todo List');
    await expect(page.getByTestId('todo-input')).toBeVisible();
    await expect(page.getByTestId('add-btn')).toBeVisible();
    await expect(page.getByTestId('remaining')).toHaveText('0 items left');
  });

  test('adds a todo item', async ({ page }) => {
    await page.getByTestId('todo-input').fill('Buy groceries');
    await page.getByTestId('add-btn').click();

    await expect(page.getByTestId('todo-1')).toBeVisible();
    await expect(page.locator('.todo-text')).toHaveText('Buy groceries');
    await expect(page.getByTestId('remaining')).toHaveText('1 items left');
  });

  test('adds todo with Enter key', async ({ page }) => {
    await page.getByTestId('todo-input').fill('Learn SpecifyJS');
    await page.getByTestId('todo-input').press('Enter');

    await expect(page.locator('.todo-text')).toHaveText('Learn SpecifyJS');
  });

  test('adds multiple todos', async ({ page }) => {
    const todos = ['First', 'Second', 'Third'];
    for (const text of todos) {
      await page.getByTestId('todo-input').fill(text);
      await page.getByTestId('add-btn').click();
    }

    await expect(page.locator('.todo-item')).toHaveCount(3);
    await expect(page.getByTestId('remaining')).toHaveText('3 items left');
  });

  test('toggles a todo completed', async ({ page }) => {
    await page.getByTestId('todo-input').fill('Complete me');
    await page.getByTestId('add-btn').click();

    await page.getByTestId('toggle-1').click();

    await expect(page.locator('.todo-item.completed')).toHaveCount(1);
    await expect(page.getByTestId('remaining')).toHaveText('0 items left');
  });

  test('deletes a todo', async ({ page }) => {
    await page.getByTestId('todo-input').fill('Delete me');
    await page.getByTestId('add-btn').click();
    await expect(page.locator('.todo-item')).toHaveCount(1);

    await page.getByTestId('delete-1').click();
    await expect(page.locator('.todo-item')).toHaveCount(0);
  });

  test('filters todos', async ({ page }) => {
    // Add two todos, complete one
    await page.getByTestId('todo-input').fill('Active item');
    await page.getByTestId('add-btn').click();
    await page.getByTestId('todo-input').fill('Done item');
    await page.getByTestId('add-btn').click();
    await page.getByTestId('toggle-2').click();

    // Filter active
    await page.getByTestId('filter-active').click();
    await expect(page.locator('.todo-item')).toHaveCount(1);
    await expect(page.locator('.todo-text')).toHaveText('Active item');

    // Filter completed
    await page.getByTestId('filter-completed').click();
    await expect(page.locator('.todo-item')).toHaveCount(1);
    await expect(page.locator('.todo-text')).toHaveText('Done item');

    // Show all
    await page.getByTestId('filter-all').click();
    await expect(page.locator('.todo-item')).toHaveCount(2);
  });

  test('clears completed todos', async ({ page }) => {
    await page.getByTestId('todo-input').fill('Keep');
    await page.getByTestId('add-btn').click();
    await page.getByTestId('todo-input').fill('Remove');
    await page.getByTestId('add-btn').click();
    await page.getByTestId('toggle-2').click();

    await page.getByTestId('clear-completed').click();

    await expect(page.locator('.todo-item')).toHaveCount(1);
    await expect(page.locator('.todo-text')).toHaveText('Keep');
  });

  test('does not add empty todo', async ({ page }) => {
    await page.getByTestId('add-btn').click();
    await expect(page.locator('.todo-item')).toHaveCount(0);

    await page.getByTestId('todo-input').fill('   ');
    await page.getByTestId('add-btn').click();
    await expect(page.locator('.todo-item')).toHaveCount(0);
  });

  test('clears input after adding', async ({ page }) => {
    await page.getByTestId('todo-input').fill('Test clear');
    await page.getByTestId('add-btn').click();
    await expect(page.getByTestId('todo-input')).toHaveValue('');
  });
});
