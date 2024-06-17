import type { Locator, Page } from '@playwright/test'

export class MainNavigation {
  readonly page: Page
  readonly menuItemSecond: Locator
  readonly menuSubcategory: Locator

  constructor(page: Page) {
    this.page = page
    this.menuItemSecond = page.locator('[data-test-id="nav-link-2045"]')
    this.menuSubcategory = page.getByRole('link', { name: 'Clothing' })
  }
}
