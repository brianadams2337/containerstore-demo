import type { Locator, Page } from '@playwright/test'

export class FreeProductList {
  readonly page: Page
  readonly addFreeProductButton: Locator

  constructor(page: Page) {
    this.page = page
    this.addFreeProductButton = page.locator(
      'button[data-testid="add-free-product-button"]:not([disabled])',
    )
  }
}
