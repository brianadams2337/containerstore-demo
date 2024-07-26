import type { Locator, Page } from '@playwright/test'

export class Pagination {
  readonly page: Page
  readonly paginationButton: Locator

  constructor(page: Page) {
    this.page = page
    this.paginationButton = page.getByTestId('paginationButton')
  }

  async scrollToPagination() {
    await this.paginationButton.first().scrollIntoViewIfNeeded()
  }
}
