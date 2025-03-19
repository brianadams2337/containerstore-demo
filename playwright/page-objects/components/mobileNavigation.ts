import type { Locator, Page } from '@playwright/test'
import { expect } from '../../fixtures/fixtures'
import { PLP_SUBCATEGORY_NAME_DE } from '../../support/constants'

export class MobileNavigation {
  readonly page: Page
  readonly sideNavigationButton: Locator
  readonly mainCategoryMenuItem: Locator
  readonly subCategoryMenuItem: Locator
  readonly searchInputField: Locator
  readonly searchSuggestionsItem: Locator
  readonly searchCategoryList: Locator
  readonly searchDisplayAllResults: Locator
  readonly searchMobile: Locator
  readonly searchForm: Locator
  readonly mobileSidebar: Locator

  constructor(page: Page) {
    this.page = page
    this.sideNavigationButton = page.getByTestId('side-navigation-button')
    this.mainCategoryMenuItem = page.getByTestId(
      'side-navigation-list-item-50337',
    )
    this.subCategoryMenuItem = page.getByRole('link', {
      name: PLP_SUBCATEGORY_NAME_DE,
    })
    this.searchInputField = page.getByTestId('header-search-input')
    this.searchCategoryList = page.getByTestId('search-category-list').nth(1)
    this.searchSuggestionsItem = page.getByTestId('search-suggestions-item')
    this.searchDisplayAllResults = page.getByTestId('display-all-results')
    this.searchMobile = page.getByTestId('search-mobile')
    this.searchForm = page.getByTestId('search-form')
    this.mobileSidebar = page.getByTestId('mobile-sidebar')
  }

  async executeMobileSearch(searchTerm: string) {
    await this.sideNavigationButton.click()
    await this.searchInputField.first().fill(searchTerm)
    await this.searchInputField.first().press('Enter')
  }

  async startTypingMobileSearch(searchTerm: string, exactProduct: boolean) {
    await this.sideNavigationButton.click()
    await this.searchInputField.first().fill(searchTerm)
    if (exactProduct === true) {
      await expect(this.searchSuggestionsItem.first()).toBeVisible()
    }
  }

  async clickSearchMoreButtonMobile() {
    await this.searchDisplayAllResults.waitFor()
    await this.searchDisplayAllResults.click()
  }

  getMobileMainCategory(value: string): Locator {
    return this.page.getByTestId(`mobile-nav-link-${value}`)
  }

  getMobileSubCategory(value: string): Locator {
    return this.page.getByTestId('mobile-navigation-item').getByText(value)
  }

  getMobileNavAccordion(value: string): Locator {
    return this.page.getByTestId('mobile-nav-accordion').getByText(value)
  }

  async navigateToPlpMobile(
    mainCategory: string,
    categoryLevel2: string,
    categoryLevel3: string,
  ) {
    await this.sideNavigationButton.click()
    await this.page.waitForLoadState('domcontentloaded')
    await this.getMobileMainCategory(mainCategory).waitFor()
    await this.getMobileMainCategory(mainCategory).click()
    await this.getMobileNavAccordion(categoryLevel2).click()
    await this.getMobileSubCategory(categoryLevel3).click()
    await this.page.waitForLoadState('domcontentloaded')
  }
}
