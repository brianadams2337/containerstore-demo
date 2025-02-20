import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { SEARCH_SUGGESTIONS } from '../../support/constants'

export class Search {
  readonly page: Page
  readonly searchButton: Locator
  readonly searchInput: Locator
  readonly searchResultsProductImage: Locator
  readonly searchResultsHeadline: Locator
  readonly searchResultsFlyout: Locator
  readonly searchDisplayAllResults: Locator
  readonly searchSuggestionsTagGroup: Locator
  readonly searchSuggestionsItem: Locator

  constructor(page: Page) {
    this.page = page
    this.searchButton = page.getByTestId('header-search-button')
    this.searchInput = page.getByTestId('header-search-input')
    this.searchResultsFlyout = page.getByTestId('search-results-flyout')
    this.searchResultsProductImage = page.getByTestId('product-image')
    this.searchResultsHeadline = page.getByTestId('headline')
    this.searchDisplayAllResults = page.getByTestId('display-all-results')
    this.searchSuggestionsTagGroup = page.getByTestId(
      'search-suggestion-tag-group',
    )
    this.searchSuggestionsItem = page.getByTestId('search-suggestions-item')
  }

  searchSuggestionTag(suggestionTag: string): Locator {
    return this.page.getByTestId(`search-suggestion-tag-${suggestionTag}`)
  }

  async executeSearch(searchTerm: string) {
    await this.searchInput.nth(1).click({ force: true })
    await this.searchInput.nth(1).fill(searchTerm)
    await this.searchInput.nth(1).press('Enter')
  }

  async startTypingSearch(searchTerm: string) {
    await this.searchInput.nth(1).click({ force: true })
    await this.searchInput.nth(1).fill(searchTerm)
    await this.searchResultsFlyout.waitFor()
    await expect(this.searchResultsFlyout).toBeVisible()
    await expect(this.searchSuggestionsItem.first()).toBeVisible()
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
    await this.searchDisplayAllResults.waitFor()
    await this.searchDisplayAllResults.click()
  }

  async clickExactProductItem() {
    await expect(this.searchSuggestionsItem).toBeVisible()
    await this.searchSuggestionsItem.click()
  }

  async assertUrlIsLoaded(path: string) {
    const pageUrl = this.page.url()
    expect(pageUrl).toContain(path)
  }
}
