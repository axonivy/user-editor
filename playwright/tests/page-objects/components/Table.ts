import { expect, type Locator, type Page } from '@playwright/test';

export class Table {
  readonly locator: Locator;
  readonly headers: Locator;
  readonly rows: Locator;

  constructor(
    readonly page: Page,
    parent: Locator
  ) {
    this.locator = parent.locator('table');
    this.headers = this.locator.locator('th');
    this.rows = this.locator.locator('tbody').getByRole('row');
  }

  header(index: number) {
    return new Header(this.headers, index);
  }

  row(index: number) {
    return new Row(this.rows.nth(index));
  }

  lastRow() {
    return new Row(this.rows.last());
  }

  async addRow() {
    const totalRows = await this.rows.count();
    await this.page.getByRole('button', { name: 'Add row' }).click();
    return this.row(totalRows);
  }

  async expectToHaveNoSelection() {
    for (let i = 0; i < (await this.rows.count()); i++) {
      const row = this.row(i);
      await row.expectNotToBeSelected();
    }
  }

  async expectToHaveRows(...rows: Array<Array<string>>) {
    for (let i = 0; i < rows.length; i++) {
      await this.row(i).expectToHaveColumns(...rows[i]!);
    }
  }

  async expectToHaveRowValues(...rows: Array<Array<string>>) {
    for (let i = 0; i < rows.length; i++) {
      await this.row(i).expectToHaveColumnValues(...rows[i]!);
    }
  }

  async clear() {
    let totalRows = await this.rows.count();
    while (totalRows > 0) {
      await this.row(totalRows - 1).locator.click();
      await this.page.keyboard.press('Delete');
      await expect(this.rows).toHaveCount(totalRows - 1);
      totalRows = await this.rows.count();
    }
  }

  async expectToHaveRowCount(expectedCount: number) {
    await expect(this.rows).toHaveCount(expectedCount);
  }
}

export class Header {
  readonly locator: Locator;
  readonly content: Locator;

  constructor(headers: Locator, index: number) {
    this.locator = headers.nth(index);
    this.content = this.locator.locator('span');
  }
}

export class Row {
  readonly locator: Locator;

  constructor(row: Locator) {
    this.locator = row;
  }

  column(index: number) {
    return new Cell(this.locator, index);
  }

  async fill(values: string[]) {
    for (let i = 0; i < values.length; i++) {
      const cell = this.column(i);
      await cell.fill(values[i]!);
    }
  }

  async expectToBeSelected() {
    await expect(this.locator).toHaveAttribute('data-state', 'selected');
  }

  async expectNotToBeSelected() {
    await expect(this.locator).toHaveAttribute('data-state', 'unselected');
  }

  async expectToHaveColumns(...values: Array<string>) {
    for (let i = 0; i < values.length; i++) {
      await this.column(i).expectToHaveText(values[i]!);
    }
  }

  async expectToHaveColumnValues(...values: Array<string>) {
    for (let i = 0; i < values.length; i++) {
      await this.column(i).expectToHaveValue(values[i]!);
    }
  }
}

export class Cell {
  readonly locator: Locator;

  constructor(row: Locator, index: number) {
    this.locator = row.getByRole('cell').nth(index);
  }

  async fill(value: string) {
    const input = this.locator.getByRole('textbox');
    await input.fill(value);
    await input.blur();
  }

  async expectToHaveText(value: string) {
    await expect(this.locator).toHaveText(value);
  }

  async expectToHaveValue(value: string) {
    await expect(this.locator.getByRole('textbox')).toHaveValue(value);
  }
}
