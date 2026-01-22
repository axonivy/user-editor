import { expect, test } from '@playwright/test';
import { AddUserDialog } from '../page-objects/AddUserDialog';
import { UserEditor } from '../page-objects/UserEditor';

test('data', async ({ page }) => {
  const editor = await UserEditor.openUser(page);
  await expect(editor.main.locator.getByText('Users').first()).toBeVisible();
  await editor.main.table.header(0).locator.getByRole('button', { name: 'Sort by Name' }).click();
  await editor.main.table.expectToHaveRows(['bf', 'Benjamin Franklin', 'Executive ManagerFinance'], ['hb', 'Hugo Boss'], ['hf', 'Henry Ford', 'IT Manager'], ['jb']);
});

test('save data', async ({ page, browserName }, testInfo) => {
  const editor = await UserEditor.openUser(page);
  const dialog = await editor.main.openAddUserDialog();
  const newUserName = `user-${browserName}-${testInfo.retry}`;
  await dialog.name.locator.fill(newUserName);
  await dialog.create.click();
  const row = editor.main.table.lastRow();
  await row.expectToHaveColumns(newUserName, '', '');

  await row.locator.click();
  await expect(editor.detail.header).toHaveText(newUserName);
  await editor.detail.fullName.fill('fullname');
  await editor.detail.roles.select('Teamleader');
  await row.expectToHaveColumns(newUserName, 'fullname', 'Teamleader');

  await page.reload();
  await row.expectToHaveColumns(newUserName, 'fullname', 'Teamleader');

  await row.locator.click();
  await editor.main.delete.click();
  await expect(row.column(0).locator).not.toHaveText(newUserName);
});

test('select user', async ({ page }) => {
  const editor = await UserEditor.openMock(page);
  await editor.main.table.expectToHaveNoSelection();
  await expect(editor.detail.header).toHaveText('User');

  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.header).toHaveText('wt');

  await editor.main.table.header(0).locator.click();
  await editor.main.table.expectToHaveNoSelection();
  await expect(editor.detail.header).toHaveText('User');
});

test('search', async ({ page }) => {
  const editor = await UserEditor.openMock(page);
  await editor.main.table.expectToHaveRowCount(8);
  await editor.main.search.fill('lead');
  await editor.main.table.expectToHaveRowCount(2);
});

test('sort', async ({ page }) => {
  const editor = await UserEditor.openMock(page);
  await editor.main.table.expectToHaveRows(['wt']);
  await editor.main.table.header(0).locator.getByRole('button', { name: 'Sort by Name' }).click();
  await editor.main.table.expectToHaveRows(['bf']);
});

test('add', async ({ page }) => {
  const editor = await UserEditor.openMock(page);
  await editor.main.table.expectToHaveRowCount(8);
  const dialog = await editor.main.openAddUserDialog();
  await dialog.name.locator.fill('NewUser');
  await dialog.cancel.click();
  await editor.main.table.expectToHaveRowCount(8);
  await editor.main.openAddUserDialog();
  await dialog.name.locator.fill('NewUser');
  await dialog.create.click();
  await editor.main.table.expectToHaveRowCount(9);
  await editor.main.table.row(8).expectToHaveColumns('NewUser');
  await editor.main.table.row(8).locator.click();
  await editor.main.delete.click();
  await editor.main.table.expectToHaveRowCount(8);
});

test('empty', async ({ page }) => {
  const editor = await UserEditor.openMock(page);
  await editor.main.table.clear();
  await expect(editor.main.locator).toBeHidden();
  const mainPanel = page.locator('.user-editor-main-panel');
  const emptyMessage = mainPanel.locator('.ui-panel-message');
  await expect(emptyMessage).toBeVisible();

  await mainPanel.locator('button', { hasText: 'Add User' }).click();
  const dialog = new AddUserDialog(page);
  await expect(dialog.locator).toBeVisible();
  await dialog.cancel.click();
  await expect(dialog.locator).toBeHidden();

  await page.keyboard.press('a');
  await expect(dialog.locator).toBeVisible();
});
