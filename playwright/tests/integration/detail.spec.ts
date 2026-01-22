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
  await expect(editor.detail.header).toHaveText('wt');
  await expect(editor.detail.content).toBeVisible();
  await expect(editor.detail.name).toHaveValue('wt');
  await expect(editor.detail.password).toBeEmpty();
  await expect(editor.detail.fullName).toHaveValue('William Tell');
  await expect(editor.detail.emailAddress).toHaveValue('william.tell@axonivy.com');
  await editor.detail.roles.expectToHaveValue('Teamleader');
  await editor.detail.properties.expectToHaveRowValues(['perms', 'sa'], ['status', 'married']);

  await editor.detail.name.fill('Updated wt');
  await editor.detail.password.fill('newpassword');
  await editor.detail.fullName.fill('Updated Full Name');
  await editor.detail.emailAddress.fill('updated.email@axonivy.com');
  await editor.detail.roles.select('Employee (All Employees)');
  const row = await editor.detail.properties.addRow();
  await row.fill(['newProp', 'newValue']);
  await editor.main.table.row(0).expectToHaveColumns('Updated wt', 'Updated Full Name', 'TeamleaderEmployee');

  await editor.main.table.row(1).locator.click();
  await expect(editor.detail.header).toHaveText('ldv');

  await editor.main.table.row(0).locator.click();
  await expect(editor.detail.header).toHaveText('Updated wt');
  await expect(editor.detail.name).toHaveValue('Updated wt');
  await expect(editor.detail.password).toHaveValue('newpassword');
  await expect(editor.detail.fullName).toHaveValue('Updated Full Name');
  await expect(editor.detail.emailAddress).toHaveValue('updated.email@axonivy.com');
  await editor.detail.roles.expectToHaveValue('Teamleader,Employee');
  await editor.detail.properties.expectToHaveRowValues(['perms', 'sa'], ['status', 'married'], ['newProp', 'newValue']);
});

test('keyboard properties', async ({ page }) => {
  const editor = await UserEditor.openMock(page);
  await editor.main.table.row(0).locator.click();
  await editor.detail.properties.expectToHaveRowValues(['perms', 'sa'], ['status', 'married']);
  await editor.detail.properties.row(0).column(0).locator.click();
  await page.keyboard.type('1');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await editor.detail.properties.expectToHaveRowCount(3);
  await page.keyboard.press('Tab');
  await page.keyboard.type('new');
  await page.keyboard.press('Escape');
  await editor.detail.properties.expectToHaveRowValues(['perms1', 'sa'], ['status', 'married'], ['new', '']);
});
