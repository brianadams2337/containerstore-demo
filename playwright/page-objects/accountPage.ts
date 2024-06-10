import { type Locator, type Page } from '@playwright/test'

export class AccountPage {
  readonly page: Page
  readonly logoutButton: Locator

  constructor(page: Page) {
    this.page = page
    // change this after fix     this.logoutButton = page.locator(
      '[data-test-id="add-item-to-basket-button"]',
    )
  }

  async clickLogoutButton() {
    await this.logoutButton.click()
  }
  async assertLogoutButtonIsVisible() {
    this.logoutButton.isVisible()
  }
}
