import type { Locator, Page } from '@playwright/test'

export class Header {
  readonly page: Page
  readonly promotionButton: Locator
  readonly promotionBanner: Locator
  readonly wishlistNumItems: Locator
  readonly headerBasketButton: Locator
  readonly headerLoginButton: Locator
  readonly basketNumItems: Locator
  readonly wishlistLink: Locator
  readonly mainHeader: Locator

  constructor(page: Page) {
    this.page = page
    this.promotionButton = page.locator(
      'data-test-id=toggle-promotion-banner-button',
    )
    this.promotionBanner = page.getByTestId('promotion-banner')
    this.wishlistNumItems = page.getByTestId('header-wishlist-count')
    this.headerBasketButton = page.getByTestId('basket-link')
    this.headerLoginButton = page.getByTestId('header-user-button')
    this.basketNumItems = page.getByTestId('header-basket-count')
    this.wishlistLink = page.getByTestId('wishlist-link')
    this.mainHeader = page.getByTestId('header')
  }

  async hidePromotionBanner() {
    await this.promotionButton.first().click({ force: true })
  }

  async visitBasketPage() {
    await this.headerBasketButton.click()
    await this.page.waitForLoadState('domcontentloaded')
  }
}
