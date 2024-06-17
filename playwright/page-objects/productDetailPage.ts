import type { Locator, Page } from '@playwright/test'

export class ProductDetailPage {
  readonly page: Page
  readonly productSizePickerToggle: Locator
  readonly productSizeValue: Locator
  readonly addToBasketButton: Locator

  constructor(page: Page) {
    this.page = page
    this.productSizePickerToggle = page.locator(
      '[data-test-id="product-size-picker-toggle"]',
    )
    this.productSizeValue = page.locator('[data-test-id="product-size"]')
    this.addToBasketButton = page.locator(
      '[data-test-id="add-item-to-basket-button"]',
    )
  }

  async pickProductSize() {
    await this.productSizePickerToggle.click()
    await this.productSizeValue.first().click()
  }

  async addProductToBasket() {
    await this.addToBasketButton.click()
  }
}
