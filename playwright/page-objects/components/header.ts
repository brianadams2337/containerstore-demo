import type { Locator, Page } from '@playwright/test'

export class Header {
  readonly page: Page
  readonly promotionButton: Locator
  readonly promotionBanner: Locator
  readonly wishlistNumItems: Locator
  readonly headerBasketButton: Locator
  readonly headerLoginButton: Locator

  constructor(page: Page) {
    this.page = page
    this.promotionButton = page.locator(
      'data-test-id=toggle-promotion-banner-button',
    )
    this.promotionBanner = page.getByTestId('promotion-banner')
    this.wishlistNumItems = page.getByTestId('wishlist-items-badge')

    this.headerBasketButton = page.getByTestId('basket-link')
    this.headerLoginButton = page.getByTestId('user-popover')
  }

  async hidePromotionBanner() {
    await this.promotionButton.first().click({ force: true })
  }

  async visitBasketPage() {
    await this.headerBasketButton.click()
  }

  async clickLoginHeaderButton() {
    await this.headerLoginButton.getByRole('link').first().click()
  }
}
