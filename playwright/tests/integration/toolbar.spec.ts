import { expect, test, type Page } from '@playwright/test';
import { UserEditor } from '../page-objects/UserEditor';

test('undo/redo', async ({ page, browserName }) => {
  const editor = await UserEditor.openMock(page);
  const toolbar = editor.toolbar;
  await expect(toolbar.undo).toBeDisabled();
  await expect(toolbar.redo).toBeDisabled();

  await editor.main.table.row(0).locator.click();
  await page.keyboard.press('Delete');
  await expect(toolbar.undo).toBeEnabled();
  await expect(toolbar.redo).toBeDisabled();

  await toolbar.undo.click();
  await expect(toolbar.undo).toBeDisabled();
  await expect(toolbar.redo).toBeEnabled();
  await toolbar.redo.click();
  await expect(toolbar.undo).toBeEnabled();
  await expect(toolbar.redo).toBeDisabled();

  await page.keyboard.press('ControlOrMeta+z');
  await expect(toolbar.undo).toBeDisabled();
  await expect(toolbar.redo).toBeEnabled();
  await page.keyboard.press(browserName === 'webkit' ? 'ControlOrMeta+Shift+z' : 'ControlOrMeta+Y');
  await expect(toolbar.undo).toBeEnabled();
  await expect(toolbar.redo).toBeDisabled();
});

test('properties', async ({ page }) => {
  const editor = await UserEditor.openMock(page);
  await expect(editor.detail.locator).toBeVisible();
  await editor.toolbar.detailToggle.click();
  await expect(editor.detail.locator).toBeHidden();
});

test('help', async ({ page }) => {
  const editor = await UserEditor.openMock(page);
  const msg1 = consoleLog(page);
  await editor.detail.help.click();
  expect(await msg1).toContain('openUrl');

  const msg2 = consoleLog(page);
  await page.keyboard.press('F1');
  expect(await msg2).toContain('openUrl');
  expect(await msg2).toContain('https://dev.axonivy.com');
});

test('focus jumps', async ({ page }) => {
  const editor = await UserEditor.openMock(page);
  await page.keyboard.press('1');
  await expect(editor.toolbar.locator).toBeFocused();
  await page.keyboard.press('2');
  await expect(editor.main.locator.locator('.ui-fieldset').first()).toBeFocused();
  await page.keyboard.press('3');
  await expect(editor.detail.header).toBeFocused();
});

const consoleLog = async (page: Page) => {
  return new Promise(result => {
    page.on('console', msg => {
      if (msg.type() === 'log') {
        result(msg.text());
      }
    });
  });
};
