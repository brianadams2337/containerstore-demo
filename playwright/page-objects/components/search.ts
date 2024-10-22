import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { SEARCH_SUGGESTIONS } from '../../support/constants'

export class Search {
  readonly page: Page
  readonly searchButton: Locator
  readonly searchInput: Locator
  readonly searchCategoryListItem: Locator
  readonly searchResultsProductImage: Locator
  readonly searchResultsHeadline: Locator
  readonly searchResultsFlyout: Locator
  readonly searchMoreButton: Locator
  readonly searchExactProduct: Locator

  constructor(page: Page) {
    this.page = page
    this.searchButton = page.getByTestId('header-search-button')
    this.searchInput = page.getByTestId('header-search-input')
    this.searchResultsFlyout = page.getByTestId('search-results-flyout')
    this.searchCategoryListItem = page.getByTestId('search-exact-product-item')
    this.searchResultsProductImage = page.getByTestId('product-image')
    this.searchResultsHeadline = page.getByTestId('headline')
    this.searchMoreButton = page.getByTestId('search-more-button')
    this.searchExactProduct = page.getByTestId('search-exact-product-item')
  }

  async executeSearch(searchTerm: string) {
    await this.searchInput.click({ force: true })
    await this.searchInput.fill(searchTerm)
    await this.searchInput.press('Enter')
  }

  async startTypingSearch(searchTerm: string) {
    await this.searchInput.click({ force: true })
    await this.searchInput.fill(searchTerm)
    await expect(this.searchResultsFlyout).toBeVisible()
    await expect(this.searchCategoryListItem.first()).toBeVisible()
  }

  async assertSearchCategorySuggestions(searchTerm: string) {
    await this.page.waitForURL(SEARCH_SUGGESTIONS.plpUrl)
    await this.page.waitForLoadState('networkidle')

    const pageUrl = this.page.url()
    expect(pageUrl).toContain(searchTerm)
  }

  async assertHeadlineSearchResults(
    searchTerm: string,
    searchCount: string = '',
  ) {
    await expect(this.searchResultsHeadline.first()).toContainText(searchTerm)
    await expect(this.searchResultsHeadline.first()).toContainText(searchCount)
  }

  async clickSearchMoreButton() {
    await this.searchMoreButton.waitFor()
    await this.searchMoreButton.click()
  }

  async clickExactProductItem() {
    await expect(this.searchExactProduct).toBeVisible()
    await this.searchExactProduct.click()
  }

  async assertPdpIsLoaded() {
    const pageUrl = this.page.url()
    expect(pageUrl).toContain(SEARCH_SUGGESTIONS.pdpUrl)
  }
}
