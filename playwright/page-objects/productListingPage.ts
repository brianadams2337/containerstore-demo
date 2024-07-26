import type { Locator, Page } from '@playwright/test'

export class ProductListingPage {
  readonly page: Page
  readonly wishlistButton: Locator
  readonly productTile: Locator
  readonly sortDropdown: Locator
  readonly filterButton: Locator
  readonly menuRootCategory: Locator
  readonly menuSubCategoryLvl1: Locator
  readonly menuSubCategoryLvl2: Locator
  readonly productItem: Locator

  constructor(page: Page) {
    this.page = page
    this.wishlistButton = page.locator(
      '[data-testid="add-item-to-wishlist-button"]',
    )
    this.productTile = page.locator('[id^="product-"]')
    this.sortDropdown = page.getByTestId('sort-dropdown')
    this.filterButton = page.getByTestId('filter-toggle-button')
    this.menuRootCategory = page
      .getByTestId('root-category-0')
      .getByRole('link')
    this.menuSubCategoryLvl1 = page
      .getByTestId('sub-category-0')
      .getByRole('link')
    this.menuSubCategoryLvl2 = page
      .getByTestId('sub-category-0_0')
      .getByRole('link')
    this.productItem = page.getByTestId('product-item')
  }

  async addProductToWishlist() {
    await this.wishlistButton.first().click()
  }

  async openProductDetails() {
    await this.productTile.first().click()
  }
}
