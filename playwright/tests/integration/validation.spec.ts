import { expect, test } from '@playwright/test';
import { UserEditor } from '../page-objects/UserEditor';

test('table', async ({ page }) => {
  const editor = await UserEditor.openMock(page);
  const dialog = await editor.main.openAddUserDialog();
  await dialog.name.locator.fill('invalid#user');
  await dialog.create.click();
  const validationRows = editor.main.table.locator.locator('.ui-message-row');
  await expect(validationRows).toHaveCount(2);
  await expect(validationRows.first()).toHaveText('User invalid#user contains invalid characters');

  const referenceButton = validationRows.first().getByRole('button', { name: 'invalid-user-name' });
  await expect(referenceButton).toBeVisible();
  await expect(editor.detail.locator.getByRole('button', { name: 'invalid-user-name' })).toBeVisible();
  await expect(validationRows.nth(1).getByRole('button')).toHaveCount(0);

  const actionLog = editor.page.waitForEvent('console', { predicate: message => message.text().startsWith('action ') });
  await referenceButton.click();
  const loggedAction = await actionLog;
  expect(loggedAction.text()).toContain('"actionId":"openUrl"');
  expect(loggedAction.text()).toContain('"payload":"https://example.com/validation/invalid-user-name"');
});

test('add user', async ({ page }) => {
  const editor = await UserEditor.openMock(page);
  const dialog = await editor.main.openAddUserDialog();
  await (await dialog.name.message()).expectToBeError('Name cannot be empty.');
  await dialog.name.locator.fill('wt');
  await (await dialog.name.message()).expectToBeError('User already exists.');
  await dialog.name.locator.fill('wt1');
  await expect((await dialog.name.message()).locator).toBeHidden();
});
