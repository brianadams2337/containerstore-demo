import { type Locator, type Page, expect } from '@playwright/test'

export class BasketPage {
  readonly page: Page
  readonly checkoutButton: Locator
  readonly productInBasket: Locator
  readonly productImage: Locator
  readonly basketProductCard: Locator

  constructor(page: Page) {
    this.page = page
    this.checkoutButton = page.locator('[data-test-id="checkout-link"]')
    this.productInBasket = page.locator('[data-test-id="basket-card"]')
    this.productImage = page.locator('[data-test-id="product-image"]')
    this.basketProductCard = page.locator('[data-test-id="basket-card"]')
  }

  async gotoCheckoutPage() {
    await this.checkoutButton.click()
  }

  async assertProductIsInBasket() {
    await expect(this.productInBasket.first()).toBeVisible()
    await expect(this.productImage.first()).toBeVisible()
  }

  async assertBasketProductDetails(
    productName: string,
    productPrice: string,
    productBrand: string,
  ) {
    expect(this.basketProductCard).toContainText(productName)
    expect(this.basketProductCard).toContainText(productPrice)
    expect(this.basketProductCard).toContainText(productBrand)
  }
}
