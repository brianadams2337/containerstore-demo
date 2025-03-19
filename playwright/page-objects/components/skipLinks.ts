import type { Locator, Page } from '@playwright/test'

export class SkipLinks {
  readonly page: Page
  readonly buttonSkipToMain: Locator
  readonly buttonSkipToSearch: Locator

  constructor(page: Page) {
    this.page = page
    this.buttonSkipToMain = page.getByTestId('button-skip-to-main')
    this.buttonSkipToSearch = page.getByTestId('button-skip-to-search')
  }
}
