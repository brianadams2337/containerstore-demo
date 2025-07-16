import type { Locator, Page } from '@playwright/test'

/**
 * Page Object Model for the website Footer component.
 * Encapsulates locators and methods for interacting with and asserting states of
 * the global footer, including its logo, copyright, and various links.
 */
export class Footer {
  private readonly page: Page
  readonly footerWrapper: Locator
  readonly footerLogo: Locator
  readonly footerCopyright: Locator
  readonly simpleFooterLink: Locator

  /**
   * Initializes the Footer Page Object.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    this.page = page
    this.footerWrapper = page.getByTestId('footer')
    this.footerLogo = page.getByTestId('footer-logo')
    this.footerCopyright = page.getByTestId('footer-copyright')
    this.simpleFooterLink = page.getByTestId('simple-footer-link')
  }
}
