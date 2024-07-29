import type { Locator, Page } from '@playwright/test'

export class MainNavigation {
  readonly page: Page
  readonly menuItemSecond: Locator

  constructor(page: Page) {
    this.page = page
    this.menuItemSecond = page.locator('[data-test-id="nav-link-frauen"]')
  }
}
