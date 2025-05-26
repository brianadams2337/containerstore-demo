import type { Locator, Page } from '@playwright/test'

export class ErrorPage {
  readonly page: Page
  readonly errorPageLogo: Locator
  readonly errorPageCode: Locator
  readonly errorPageButtonContinue: Locator

  constructor(page: Page) {
    this.page = page
    this.errorPageLogo = page.getByTestId('error-page-logo')
    this.errorPageCode = page.getByTestId('error-page-code')
    this.errorPageButtonContinue = page.getByTestId(
      'error-page-button-continue',
    )
  }
}
