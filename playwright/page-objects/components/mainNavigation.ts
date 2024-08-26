import type { Locator, Page } from '@playwright/test'

export class MainNavigation {
  readonly page: Page
  readonly menuTestCategory: Locator

  constructor(page: Page) {
    this.page = page
    this.menuTestCategory = page.getByTestId('nav-link-frauen')
  }

  async mainMenuCategoryClick() {
    await this.menuTestCategory.click()
  }
}
