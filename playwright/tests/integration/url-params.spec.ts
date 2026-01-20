import { expect, test } from '@playwright/test';
import { UserEditor } from '../page-objects/UserEditor';

test('theme light', async ({ page }) => {
  await UserEditor.openUser(page, { theme: 'light' });
  await expect(page.locator('html')).toHaveClass('light');
});

test('theme dark', async ({ page }) => {
  await UserEditor.openUser(page, { theme: 'dark' });
  await expect(page.locator('html')).toHaveClass('dark');
});

// eslint-disable-next-line playwright/no-skipped-test
test.skip('readonly false', async ({ page }) => {
  const editor = await UserEditor.openUser(page, { readonly: false });
  await expect(editor.toolbar.redo).toBeVisible();
  await expect(editor.toolbar.undo).toBeVisible();
  await expect(editor.main.add).toBeVisible();
  await expect(editor.main.delete).toBeVisible();
});

// eslint-disable-next-line playwright/no-skipped-test
test.skip('readonly true', async ({ page }) => {
  const editor = await UserEditor.openUser(page, { readonly: true });
  await expect(editor.main.locator).toBeVisible();
  await expect(editor.toolbar.redo).toBeHidden();
  await expect(editor.toolbar.undo).toBeHidden();
  await expect(editor.main.add).toBeHidden();
  await expect(editor.main.delete).toBeHidden();

  await page.keyboard.press('a');
  await expect(page.getByRole('dialog')).toBeHidden();
});
