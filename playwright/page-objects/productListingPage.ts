import type { Locator, Page } from '@playwright/test'

export class ProductListingPage {
  readonly page: Page
  readonly wishlistButton: Locator
  readonly productTile: Locator

  constructor(page: Page) {
    this.page = page
    this.wishlistButton = page.locator(
      '[data-test-id="add-item-to-wishlist-button"]',
    )
    this.productTile = page.locator('[id^="product-"]')
  }

  async addProductToWishlist() {
    await this.wishlistButton.first().click()
  }

  async openProductDetails() {
    await this.productTile.first().click()
  }
}
