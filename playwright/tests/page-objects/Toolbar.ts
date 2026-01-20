import type { Locator, Page } from '@playwright/test';

export class Toolbar {
  readonly locator: Locator;
  readonly title: Locator;
  readonly detailToggle: Locator;
  readonly undo: Locator;
  readonly redo: Locator;

  constructor(page: Page) {
    this.locator = page.locator('.user-editor-main-toolbar');
    this.title = this.locator.locator('.user-editor-main-toolbar-title');
    this.detailToggle = this.locator.getByRole('button', { name: 'Details' });
    this.undo = this.locator.getByRole('button', { name: 'Undo' });
    this.redo = this.locator.getByRole('button', { name: 'Redo' });
  }
}
