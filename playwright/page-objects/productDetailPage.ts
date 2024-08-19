import type { Locator, Page } from '@playwright/test'

export class ProductDetailPage {
  readonly page: Page
  readonly productSizePickerToggle: Locator
  readonly productSizeValue: Locator
  readonly addToBasketButton: Locator
  readonly productImage: Locator

  constructor(page: Page) {
    this.page = page
    this.productSizePickerToggle = page.getByTestId(
      'product-size-picker-toggle',
    )
    this.productSizeValue = page.locator(
      '[data-testid="product-size"] >> button:not([disabled=""])',
    )
    this.addToBasketButton = page.getByTestId('add-item-to-basket-button')
    this.productImage = page.getByTestId('product-image')
  }

  async pickProductSize() {
    await this.productSizePickerToggle.click()
    await this.productSizeValue.first().scrollIntoViewIfNeeded()
    await this.productSizeValue.first().click()
  }

  async addProductToBasket() {
    await this.addToBasketButton.click()
  }
}
