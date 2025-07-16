import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'

/**
 * Page Object Model for the Search functionality.
 * Encapsulates locators and methods for interacting with search inputs,
 * managing search results, and verifying search suggestions and pages.
 */
export class Search {
  private readonly page: Page

  // --- Search Input & Form Locators ---
  /**
   * Locator for the main search input field (e.g., in the header or a flyout).
   * @note This locator often targets a specific search input instance (e.g., desktop header search, commonly `nth(1)` if there are multiple).
   */
  readonly searchInput: Locator
  readonly searchForm: Locator
  readonly searchResetButton: Locator

  // --- Search Results & Flyout Locators ---
  readonly searchResultsFlyout: Locator
  readonly searchResultsProductImage: Locator
  readonly searchResultsHeadline: Locator
  readonly searchDisplayAllResults: Locator
  readonly h1: Locator

  // --- Search Suggestions Locators ---
  readonly searchSuggestionsTagGroup: Locator
  readonly searchSuggestionsItem: Locator

  /**
   * Initializes the Search Page Object.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    this.page = page
    this.searchInput = page.getByTestId('header-search-input')
    this.searchResultsFlyout = page.getByTestId('search-results-flyout')
    this.searchResultsProductImage = page.getByTestId('product-image')
    this.searchResultsHeadline = page.getByTestId('headline')
    this.searchDisplayAllResults = page.getByTestId('display-all-results')
    this.searchSuggestionsTagGroup = page.getByTestId(
      'search-suggestion-tag-group',
    )
    this.searchSuggestionsItem = page.getByTestId('search-suggestions-item')
    this.searchForm = page.getByTestId('search-form')
    this.searchResetButton = page.getByTestId('search-reset-button')
    this.h1 = page.locator('h1')
  }

  // --- Action Methods ---

  /**
   * Executes a search by filling the input field and pressing Enter.
   * @param searchTerm - The term to search for.
   * @note This method hardcodes interaction with the second search input (`.nth(1)`), likely the desktop header search.
   */
  async executeSearch(searchTerm: string) {
    await this.searchInput.nth(1).click({ force: true })
    await this.searchInput.nth(1).fill(searchTerm)
    await this.searchInput.nth(1).press('Enter')
  }

  /**
   * Starts typing a search term into the input field, but does not submit the search.
   * This is typically used to trigger search suggestions or a search flyout.
   * @param searchTerm - The term to type into the search input.
   */
  async startTypingSearch(searchTerm: string) {
    await this.searchInput.nth(1).click({ force: true })
    await this.searchInput.nth(1).fill(searchTerm)
  }

  /**
   * Clicks the "Display All Results" button in the search suggestions/flyout.
   */
  async clickSearchMoreButton() {
    await this.searchDisplayAllResults.waitFor()
    await this.searchDisplayAllResults.click()
  }

  /**
   * Clicks on the first exact product match suggestion item from the search suggestions.
   */
  async clickExactProductItem() {
    await this.searchSuggestionsItem.click()
  }

  // --- Assertion Methods ---

  /**
   * Asserts that the search results headline contains the specified search term.
   * @param searchTerm - The term expected to be present in the headline.
   */
  async assertHeadlineSearchResults(searchTerm: string) {
    await expect(this.searchResultsHeadline.first()).toContainText(searchTerm)
  }

  /**
   * Asserts that the current page URL contains a specific path segment.
   * Useful for verifying navigation after a search or suggestion click.
   * @param path - The path segment expected to be in the URL (e.g., 'search?filters', '/p/product-id').
   */
  async assertUrlIsLoaded(path: string) {
    const pageUrl = this.page.url()

    expect(pageUrl).toContain(path)
  }
}
