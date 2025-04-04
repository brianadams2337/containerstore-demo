import type { Locator, Page } from '@playwright/test'

export class Promotions {
  readonly page: Page
  readonly promotionRibbon: Locator
  readonly promotionRibbonTimer: Locator
  readonly promotionRibbonHeadline: Locator
  readonly promotionRibbonSubheadline: Locator
  readonly closeFlyoutButton: Locator
  readonly promotionsCounter: Locator
  readonly promotionCard: Locator

  constructor(page: Page) {
    this.page = page
    this.promotionRibbon = page.getByTestId('promotion-ribbon')
    this.promotionRibbonTimer = page.getByTestId('promotion-ribbon-timer')
    this.promotionRibbonHeadline = page.getByTestId('promotion-ribbon-headline')
    this.promotionRibbonSubheadline = page.getByTestId(
      'promotion-ribbon-subheadline',
    )
    this.closeFlyoutButton = page.getByTestId('close-promotions')
    this.promotionsCounter = page.getByTestId('promotion-counter')
    this.promotionCard = page.getByTestId('promotion-card')
  }
}
