import type { Locator, Page } from '@playwright/test';

export class Toolbar {
  readonly locator: Locator;
  readonly detailToggle: Locator;
  readonly undo: Locator;
  readonly redo: Locator;

  constructor(page: Page) {
    this.locator = page.locator('.ui-toolbar');
    this.detailToggle = this.locator.getByRole('button', { name: 'Details' });
    this.undo = this.locator.getByRole('button', { name: 'Undo' });
    this.redo = this.locator.getByRole('button', { name: 'Redo' });
  }
}
