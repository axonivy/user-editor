import { test } from '@playwright/test';
import { UserEditor } from '../page-objects/UserEditor';
import { screenshot } from './screenshot-util';

test('editor', async ({ page }) => {
  const editor = await UserEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  await screenshot(page, 'user-editor');
});
