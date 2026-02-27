import { expect, type Locator, type Page } from '@playwright/test';
import { AddUserDialog } from './AddUserDialog';
import { Table } from './components/Table';

export class Main {
  readonly locator: Locator;
  readonly add: Locator;
  readonly delete: Locator;
  readonly search: Locator;
  readonly table: Table;

  constructor(readonly page: Page) {
    this.locator = page.locator('#user-editor-main');
    this.add = this.locator.getByRole('button', { name: 'Add User' });
    this.delete = this.locator.getByRole('button', { name: 'Delete User' });
    this.search = this.locator.getByRole('textbox').first();
    this.table = new Table(page, this.locator);
  }

  public async openAddUserDialog() {
    await this.add.click();
    const dialog = new AddUserDialog(this.page);
    await expect(dialog.locator).toBeVisible();
    return dialog;
  }
}
