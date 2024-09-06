import type { Locator, Page } from '@playwright/test'

export class HomePage {
  readonly page: Page
  readonly homepageContent: Locator

  constructor(page: Page) {
    this.page = page
    this.homepageContent = page.getByTestId('home-page-content')
  }

  async visitPage() {
    await this.page.goto('/', { waitUntil: 'commit' })
  }
}
