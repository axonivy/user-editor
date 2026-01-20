import { expect, test } from '@playwright/test';
import { UserEditor } from '../page-objects/UserEditor';

test('empty', async ({ page }) => {
  const editor = await UserEditor.openMock(page);
  await expect(editor.detail.header).toHaveText('User');
  await expect(editor.detail.content).toBeHidden();
  const emptyMessage = editor.detail.locator.locator('.ui-panel-message');
  await expect(emptyMessage).toBeVisible();
  await expect(emptyMessage).toHaveText('No User Selected');
});

test('edit user', async ({ page }) => {
  const editor = await UserEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.header).toHaveText('Employee');
  await expect(editor.detail.content).toBeVisible();

  await expect(editor.detail.name).toHaveValue('Employee');

  await editor.detail.name.fill('Updated Employee user');
  await page.keyboard.press('Escape');
  await editor.main.table.row(0).expectToHaveColumns('Updated Employee user');
});
