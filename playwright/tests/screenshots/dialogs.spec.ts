import { test } from '@playwright/test';
import { UserEditor } from '../page-objects/UserEditor';
import { screenshotElement } from './screenshot-util';

test('add user', async ({ page }) => {
  const editor = await UserEditor.openMock(page);
  const dialog = await editor.main.openAddUserDialog();
  await dialog.name.locator.fill('New User');
  await screenshotElement(dialog.locator, 'dialog-add-user');
});
