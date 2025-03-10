import type { Locator, Page } from '@playwright/test'

export class CheckoutPage {
  readonly page: Page
  readonly basketContainer: Locator
  readonly deliveryEstimate: Locator
  readonly itemIdentifier: Locator
  readonly basketItem: Locator
  readonly priceSummarySubtotal: Locator
  readonly priceSummaryShippingCost: Locator
  readonly priceSummaryTotal: Locator
  readonly itemQuantity: Locator
  readonly itemQuantityValue: Locator
  readonly itemQuantityMinus: Locator
  readonly itemQuantityPlus: Locator
  readonly itemPrice: Locator
  readonly buttonItemRemove: Locator
  readonly checkboxAcceptTerms: Locator
  readonly ctaPayButton: Locator

  constructor(page: Page) {
    this.page = page
    this.basketContainer = page.locator('[data-test-id="basket-container"]')
    this.deliveryEstimate = page.locator('[data-test-id="delivery-estimate"]')
    this.itemIdentifier = page.locator('[data-test-id="item-identifier"]')
    this.basketItem = page.locator('[data-test-id^="basket-item-"]')
    this.priceSummarySubtotal = page.locator(
      '[data-test-id="price-summary-subtotal"]',
    )
    this.priceSummaryShippingCost = page.locator(
      '[data-test-id="price-summary-shipping-cost"]',
    )
    this.priceSummaryTotal = page.locator(
      '[data-test-id="price-summary-total"]',
    )
    this.itemQuantity = page.locator('[data-test-id="item-quantity"]')
    this.itemQuantityValue = page.locator(
      '[data-test-id="item-quantity-value"]',
    )
    this.itemQuantityMinus = page.locator(
      '[data-test-id="item-quantity-minus"]',
    )
    this.itemQuantityPlus = page.locator('[data-test-id="item-quantity-plus"]')
    this.itemPrice = page.locator('[data-test-id="item-price"]')
    this.buttonItemRemove = page.locator('[data-test-id="item-remove"]')
    this.checkboxAcceptTerms = page.locator(
      '[data-test-id="paymentBelowMobileBasket-termsAndPrivacy-checkbox"]',
    )
    this.ctaPayButton = page.locator('[data-test-id="navigation-next-step"]')
  }
}
