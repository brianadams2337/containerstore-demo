import { type Locator, type Page, expect } from '@playwright/test'

export class BasketPage {
  readonly page: Page
  readonly checkoutButton: Locator
  readonly productInBasket: Locator
  readonly productImage: Locator
  readonly basketProductCard: Locator

  constructor(page: Page) {
    this.page = page
    this.checkoutButton = page.getByTestId('checkout-link')
    this.productInBasket = page.getByTestId('basket-card')
    this.productImage = page.getByTestId('product-image')
    this.basketProductCard = page.getByTestId('basket-card')
  }

  async gotoCheckoutPage() {
    await this.checkoutButton.waitFor({ state: 'visible' })
    await this.checkoutButton.click()
  }

  async assertProductIsInBasket() {
    await expect(this.productInBasket.first()).toBeVisible()
    await expect(this.productImage.first()).toBeVisible()
  }
}
