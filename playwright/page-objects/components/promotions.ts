import type { Locator, Page } from '@playwright/test'
import { expect } from '../../fixtures/fixtures'
import { isMobile } from '../../support/utils'

export class Promotions {
  readonly page: Page
  readonly promotionBanner: Locator
  readonly promotionBannerMobile: Locator
  readonly buttonToggleBanner: Locator
  readonly buttonToggleBannerMobile: Locator
  readonly buttonCloseBanner: Locator
  readonly buttonCloseBannerMobile: Locator
  readonly promotionCountdown: Locator
  readonly promotionCountdownMobile: Locator
  readonly buttonShowDeals: Locator
  readonly promotionList: Locator
  readonly promotionListMobile: Locator

  constructor(page: Page) {
    this.page = page
    this.promotionBanner = page.getByTestId('promotion-banner')
    this.promotionBannerMobile = page.getByTestId('promotion-banner-mobile')
    this.buttonToggleBanner = page.getByTestId('toggle-promotion-banner-button')
    this.buttonToggleBannerMobile = page.getByTestId(
      'toggle-promo-button-mobile',
    )
    this.buttonCloseBanner = page.getByTestId('close-promotion-button')
    this.buttonCloseBannerMobile = page.getByTestId(
      'close-promotion-button-mobile',
    )
    this.promotionCountdown = page.getByTestId('promotion-countdown')
    this.promotionCountdownMobile = page.getByTestId(
      'promotion-countdown-mobile',
    )
    this.buttonShowDeals = page.getByTestId('show-deals-button')
    this.promotionList = page.getByTestId('promotion-list')
    this.promotionListMobile = page.getByTestId('promotion-list-mobile')
  }

  async clickToggleButton() {
    await this.buttonToggleBanner.first().waitFor()
    await this.buttonToggleBanner.first().click()
  }

  async isPromoBarExpanded() {
    const ariaExpanded = await this.buttonToggleBanner
      .first()
      .getAttribute('aria-expanded')
    return ariaExpanded === 'true'
  }

  async assertPromoBarOpen() {
    if (isMobile(this.page)) {
      await this.promotionBannerMobile.waitFor()
      await expect(this.promotionBannerMobile).toBeVisible()
      await expect(this.promotionCountdownMobile).toBeVisible()
    } else {
      await this.promotionBanner.waitFor()
      await expect(this.promotionBanner).toBeVisible()
      await expect(this.buttonToggleBanner).toBeVisible()
      await expect(this.promotionCountdown).toBeVisible()
    }
  }

  async assertPromoBarClosed() {
    if (isMobile(this.page)) {
      await this.buttonToggleBannerMobile.click()
      await this.page.waitForLoadState('networkidle')
      await expect(this.buttonToggleBannerMobile).toHaveAttribute(
        'aria-expanded',
        'false',
      )
    } else {
      await this.buttonToggleBanner.click()
      await this.page.waitForLoadState('networkidle')
      await expect(this.buttonToggleBanner).toHaveAttribute(
        'aria-expanded',
        'false',
      )
    }
  }

  async expandPromotionBar() {
    if (isMobile(this.page)) {
      await expect(async () => {
        await this.promotionBannerMobile.waitFor()
        await this.page.waitForTimeout(3000)
        await this.promotionBannerMobile.click()
        await this.buttonCloseBannerMobile.waitFor()
      }).toPass()
    } else {
      await expect(async () => {
        await this.promotionBanner.waitFor()
        await this.page.waitForTimeout(3000)
        await this.promotionBanner.click()
        await this.buttonCloseBanner.waitFor()
      }).toPass()
    }
  }

  async assertPromotionBarExpanded() {
    if (isMobile(this.page)) {
      await this.buttonCloseBannerMobile.waitFor()
      await expect(this.buttonCloseBannerMobile).toBeVisible()
      await expect(this.promotionListMobile.first()).toBeVisible()
    } else {
      await this.buttonCloseBanner.waitFor()
      await expect(this.buttonCloseBanner).toBeVisible()
      await expect(this.promotionList).toBeVisible()
    }
  }

  async closePromotionBar() {
    if (isMobile(this.page)) {
      await this.buttonCloseBannerMobile.click()
      await this.promotionBannerMobile.waitFor()
    } else {
      await this.buttonCloseBanner.click()
      await this.promotionBanner.waitFor()
    }
  }

  async assertScrollBehavior() {
    if (isMobile(this.page)) {
      await expect(this.promotionBannerMobile).toBeInViewport()
    } else {
      await expect(this.promotionBanner).not.toBeInViewport()
    }
  }
}
