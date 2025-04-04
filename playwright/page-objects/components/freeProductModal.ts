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
    this.freeProductModalWindow = page.locator(
      '[data-testid="promo-product-selection-modal"][open]',
    )
    this.addToBasketButton = page.getByTestId('add-item-to-basket-button')
    this.variantPicker =
      this.freeProductModalWindow.getByTestId('variant-picker')
    this.addItemToBasketButton = this.freeProductModalWindow.getByTestId(
      'add-item-to-basket-button',
    )
    this.productName =
      this.freeProductModalWindow.getByTestId('pdp-product-name')
  }
}
