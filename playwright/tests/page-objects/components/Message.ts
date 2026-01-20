import { expect, type Locator } from '@playwright/test';

export class Message {
  readonly locator: Locator;

  constructor(parent: Locator, options?: { id?: string; className?: string }) {
    if (options?.id) {
      this.locator = parent.locator(`[id="${options.id}"]`);
    } else if (options?.className) {
      this.locator = parent.locator(`.ui-message.${options.className}`);
    } else {
      this.locator = parent.locator('.ui-message').first();
    }
  }

  async expectToBeInfo(message: string) {
    await expect(this.locator).toHaveText(message);
    await expect(this.locator).toHaveAttribute('data-state', 'info');
  }

  async expectToBeError(message: string) {
    await expect(this.locator).toHaveText(message);
    await expect(this.locator).toHaveAttribute('data-state', 'error');
  }
}
