import { type Locator, type Page } from '@playwright/test';

export class Detail {
  readonly page: Page;
  readonly locator: Locator;
  readonly header: Locator;
  readonly help: Locator;
  readonly content: Locator;
  readonly name: Locator;

  constructor(page: Page) {
    this.page = page;
    this.locator = this.page.locator('.user-editor-detail-panel');
    this.header = this.locator.locator('.user-editor-detail-header');
    this.help = this.locator.getByRole('button', { name: 'Open Help' });
    this.content = this.locator.locator('.user-editor-detail-content');
    this.name = this.locator.getByLabel('Name', { exact: true });
  }
}
