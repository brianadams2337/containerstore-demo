import type { Locator, Page } from '@playwright/test'

export class CheckoutPage {
  readonly page: Page
  readonly basketContainer: Locator
  readonly deliveryEstimate: Locator
  readonly itemQuantity: Locator
  readonly buttonItemRemove: Locator
  readonly checkboxAcceptTerms: Locator
  readonly ctaPayButton: Locator

  constructor(page: Page) {
    this.page = page
    this.basketContainer = page.locator('[data-test-id="basket-container"]')
    this.deliveryEstimate = page.locator('[data-test-id="delivery-estimate"]')
    this.itemQuantity = page.locator('[data-test-id="item-quantity"]')
    this.buttonItemRemove = page.locator('[data-test-id="item-remove"]')
    this.checkboxAcceptTerms = page.locator(
      '[data-test-id="paymentBelowMobileBasket-termsAndPrivacy"]',
    )
    this.ctaPayButton = page.locator('[data-test-id="navigation-next-step"]')
  }
}
