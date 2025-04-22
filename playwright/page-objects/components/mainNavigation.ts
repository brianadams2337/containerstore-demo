import type { Locator, Page } from '@playwright/test'

export class MainNavigation {
  readonly page: Page
  readonly desktopNavigationFlyout: Locator
  readonly navigationItem: Locator
  readonly navigationLinkMain: Locator

  constructor(page: Page) {
    this.page = page
    this.desktopNavigationFlyout = page.getByTestId('desktop-navigation-flyout')
    this.navigationItem = page.getByTestId('navigation-item')
    this.navigationLinkMain = page.getByTestId('nav-link-main')
  }

  getMainCategory(value: Locator): Locator {
    return this.page.getByTestId(`nav-link-${value}`)
  }

  getSubCategory(value: string): Locator {
    return this.page.getByTestId('navigation-item').getByText(value)
  }

  async openMainNavigationOverlay() {
    await this.navigationLinkMain.nth(1).waitFor()
    await this.navigationLinkMain.nth(1).hover()
    await this.desktopNavigationFlyout.waitFor()
  }

  async navigateToPlpMainCategory() {
    await this.navigationLinkMain.nth(1).click()
    await this.page.mouse.move(0, 0)
    await this.page.waitForLoadState('domcontentloaded')
  }

  async navigateToPlpSubCategory() {
    await this.navigationLinkMain.nth(1).waitFor()
    await this.navigationLinkMain.nth(1).hover()
    await this.desktopNavigationFlyout.waitFor()
    await this.navigationItem.nth(0).click()
    await this.page.waitForLoadState('domcontentloaded')
  }
}
