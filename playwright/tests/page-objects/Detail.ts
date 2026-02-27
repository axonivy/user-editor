import { type Locator, type Page } from '@playwright/test';
import { Combobox } from './components/Combobox';
import { Table } from './components/Table';

export class Detail {
  readonly page: Page;
  readonly locator: Locator;
  readonly header: Locator;
  readonly help: Locator;
  readonly name: Locator;
  readonly password: Locator;
  readonly fullName: Locator;
  readonly emailAddress: Locator;
  readonly roles: Combobox;
  readonly properties: Table;

  constructor(page: Page) {
    this.page = page;
    this.locator = this.page.locator('#user-editor-detail');
    this.header = this.locator.locator('.ui-sidebar-header');
    this.help = this.locator.getByRole('button', { name: 'Open Help' });
    this.name = this.locator.getByLabel('Name', { exact: true });
    this.password = this.locator.getByLabel('Password', { exact: true });
    this.fullName = this.locator.getByLabel('Full Name', { exact: true });
    this.emailAddress = this.locator.getByLabel('Email Address', { exact: true });
    this.roles = new Combobox(page, this.locator, { name: 'Roles' });
    this.properties = new Table(page, this.locator);
  }
}
