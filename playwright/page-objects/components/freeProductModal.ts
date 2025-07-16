import type { Locator, Page } from '@playwright/test'

/**
 * Page Object Model for the Free Product Selection Modal.
 * Encapsulates locators and methods for interacting with a modal that allows users
 * to select a free product, typically as part of a promotion or offer.
 */
export class FreeProductModal {
  private readonly page: Page

  // --- Modal Elements ---
  readonly freeProductModalWindow: Locator
  readonly variantPicker: Locator
  readonly addItemToBasketButton: Locator

  /**
   * Initializes the FreeProductModal Page Object.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    this.page = page
    this.freeProductModalWindow = page.locator(
      '[data-testid="promo-product-selection-modal"][open]',
    )
    this.variantPicker =
      this.freeProductModalWindow.getByTestId('variant-picker')
    this.addItemToBasketButton = this.freeProductModalWindow.getByTestId(
      'add-item-to-basket-button',
    )
  }
}
