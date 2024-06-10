import { type Page, expect } from '@playwright/test'
import { E2E_CHECKOUT_URL } from '../support/constants'

export class CheckoutPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async assertCheckoutPageURL() {
    await this.page.waitForURL(E2E_CHECKOUT_URL)
    await expect(this.page).toHaveURL(E2E_CHECKOUT_URL)
  }
}
