import { type Page } from '@playwright/test'

export class ProductListingPage {
  readonly page: Page
  readonly wishlistButton: string

  constructor(page: Page) {
    this.page = page
    this.wishlistButton = '[data-test-id="add-item-to-wishlist-button"]'
  }

  async addProductToWishlist(productID: string) {
    const addToWishlistButton = this.page.locator(
      productID + ' ' + this.wishlistButton,
    )
    await addToWishlistButton.click()
  }

  async openProductbyID(productLocator: string) {
    const productTile = this.page.locator(productLocator)

    await productTile.click()
  }
}
