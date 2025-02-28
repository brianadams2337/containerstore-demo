import type { Locator, Page } from '@playwright/test'

export class FreeProductModal {
  readonly page: Page
  readonly freeProductModalWindow: Locator
  readonly addToBasketButton: Locator
  readonly variantPicker: Locator
  readonly addItemToBasketButton: Locator
  readonly productName: Locator

  constructor(page: Page) {
    this.page = page
    this.freeProductModalWindow = page.getByTestId(
      'promo-product-selection-modal',
    )
    this.addToBasketButton = page.getByTestId('add-item-to-basket-button')
    this.variantPicker = page.getByTestId('variant-picker')
    this.addItemToBasketButton = page.getByTestId('add-item-to-basket-button')
    this.productName = page.getByTestId('pdp-product-name')
  }
}
