import type { Locator, Page } from '@playwright/test'

/**
 * Page Object Model for Homepage.
 * Encapsulates locators and methods for interacting with elements on Homepage.
 */
export class HomePage {
  private readonly page: Page
  readonly homepageContent: Locator
  readonly homepageMainContent: Locator

  /**
   * Initializes the HomePage Page Object.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    this.page = page
    this.homepageContent = page.getByTestId('home-page-content')
    this.homepageMainContent = page.getByTestId('main-content')
  }

  async visitPage() {
    await this.page.goto('/', { waitUntil: 'commit' })
  }
}
