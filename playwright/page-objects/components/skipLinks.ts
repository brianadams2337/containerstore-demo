import type { Locator, Page } from '@playwright/test'

/**
 * Page Object Model for Accessibility Skip Links.
 * Encapsulates locators for "skip to content" or "skip to search" links,
 * which aid keyboard navigation and accessibility.
 */
export class SkipLinks {
  private readonly page: Page

  // --- Skip Link Buttons ---
  readonly buttonSkipToMain: Locator
  readonly buttonSkipToSearch: Locator

  /**
   * Initializes the SkipLinks Page Object.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    this.page = page
    this.buttonSkipToMain = page.getByTestId('button-skip-to-main')
    this.buttonSkipToSearch = page.getByTestId('button-skip-to-search')
  }
}
