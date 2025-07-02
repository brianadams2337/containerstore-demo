import type { Locator, Page } from '@playwright/test'

export class ProductListingPage {
  readonly page: Page
  readonly wishlistButton: Locator
  readonly productTile: Locator
  readonly menuRootCategory: Locator
  readonly productItem: Locator
  readonly removeFromWishlistButton: Locator
  readonly productSibling: Locator
  readonly productImage: Locator
  readonly productCard: Locator
  readonly h1: Locator
  readonly pageTitle: Locator
  readonly sideNavigation: Locator

  constructor(page: Page) {
    this.page = page
    this.wishlistButton = page.locator(
      '[data-testid="add-item-to-wishlist-button"]',
    )
    this.productTile = page.locator('[id^="product-"]')
    this.menuRootCategory = page.getByTestId('root-category-0')
    this.productItem = page.getByTestId('product-item')
    this.removeFromWishlistButton = page.getByTestId(
      'remove-item-from-wishlist-button',
    )
    this.productSibling = page.getByTestId('product-sibling')
    this.productImage = page.getByTestId('product-image')
    this.productCard = page.locator('article[id^="product-"]')
    this.h1 = page.locator('h1')
    this.pageTitle = page.getByTestId('active-category-breadcrumb')
    this.sideNavigation = page.getByTestId('side-navigation')
  }

  async addProductToWishlist() {
    await this.wishlistButton.first().click()
  }

  async removeProductFromWishlist() {
    await this.removeFromWishlistButton.first().click()
  }

  async addFiltersToPLP(filters = {}) {
    const pageUrl = this.page.url()
    const formattedFilters = Object.entries(filters).map(
      ([key, value]) => `filters[${key}]=${value}`,
    )
    const url =
      pageUrl +
      (formattedFilters.length ? `?${formattedFilters.join('&')}` : '')
    await this.page.goto(url, { waitUntil: 'load' })
  }
}
