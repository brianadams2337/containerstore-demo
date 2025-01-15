import type { Locator, Page } from '@playwright/test'

export class MainNavigation {
  readonly page: Page
  readonly desktopNavigationFlyout: Locator
  readonly navigationItem: Locator

  constructor(page: Page) {
    this.page = page
    this.desktopNavigationFlyout = page.getByTestId('desktop-navigation-flyout')
    this.navigationItem = page.getByTestId('navigation-item')
  }

  getMainCategory(value: string): Locator {
    return this.page.getByTestId(`nav-link-${value}`)
  }

  getSubCategory(value: string): Locator {
    return this.page.getByTestId('navigation-item').getByText(value)
  }

  async openMainNavigationOverlay(mainCategory: string) {
    await this.getMainCategory(mainCategory).waitFor()
    await this.getMainCategory(mainCategory).hover()
    await this.desktopNavigationFlyout.waitFor()
  }

  async navigateToPlpMainCategory(mainCategory: string) {
    await this.getMainCategory(mainCategory).click()
    await this.page.waitForLoadState('domcontentloaded')
  }

  async navigateToPlpSubCategory(mainCategory: string, subCategory: string) {
    await this.getMainCategory(mainCategory).waitFor()
    await this.getMainCategory(mainCategory).hover()
    await this.desktopNavigationFlyout.waitFor()
    await this.getSubCategory(subCategory).click()
  }
}
