import { expect, test } from '@playwright/test';
import { UserEditor } from '../page-objects/UserEditor';

test('table', async ({ page }) => {
  const editor = await UserEditor.openMock(page);
  const dialog = await editor.main.openAddUserDialog();
  await dialog.name.locator.fill('invalid#user');
  await dialog.create.click();
  await expect(editor.main.table.locator.locator('.ui-message-row')).toHaveText('User invalid#user contains invalid characters');
});

test('add user', async ({ page }) => {
  const editor = await UserEditor.openMock(page);
  const dialog = await editor.main.openAddUserDialog();
  await (await dialog.name.message()).expectToBeError('Name cannot be empty.');
  await dialog.name.locator.fill('Employee');
  await (await dialog.name.message()).expectToBeError('User already exists.');
  await dialog.name.locator.fill('Employee1');
  await expect((await dialog.name.message()).locator).toBeHidden();
});
