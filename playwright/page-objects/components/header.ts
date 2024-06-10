import { type Locator, type Page } from '@playwright/test'

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
    this.promotionBanner = page.locator('data-test-id=promotion-banner')
    this.wishlistNumItems = page.locator(
      '#header div:nth-child(1) div.flex.flex-1.justify-end div:nth-child(3) a span',
    )

    this.headerBasketButton = page.locator('[data-test-id="basket-link"]')
    this.headerLoginButton = page.locator('[data-test-id="user-popover"]')
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
