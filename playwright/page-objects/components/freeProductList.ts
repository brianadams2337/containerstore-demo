import type { Locator, Page } from '@playwright/test'

export class FreeProductList {
  readonly page: Page
  readonly freeProductsSelection: Locator
  readonly addFreeProductButton: Locator

  constructor(page: Page) {
    this.page = page
    this.freeProductsSelection = page.getByTestId('product-promotion-gifts')
    this.addFreeProductButton = page.getByTestId('add-free-product-button')
  }
}
