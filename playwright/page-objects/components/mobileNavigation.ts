import type { Locator, Page } from '@playwright/test'
import { expect } from '../../fixtures/fixtures'

export class MobileNavigation {
  readonly page: Page
  readonly sideNavigationButton: Locator
  readonly mainCategoryMenuItem: Locator
  readonly searchInputField: Locator
  readonly searchSuggestionsItem: Locator
  readonly searchCategoryList: Locator
  readonly searchDisplayAllResults: Locator
  readonly searchMobile: Locator
  readonly searchForm: Locator
  readonly mobileSidebar: Locator
  readonly logoutButton: Locator
  readonly mobileNavLinkMain: Locator
  readonly mobileNavAccordion: Locator
  readonly mobileNavigationItem: Locator

  constructor(page: Page) {
    this.page = page
    this.sideNavigationButton = page.getByTestId('side-navigation-button')
    this.mainCategoryMenuItem = page.getByTestId(
      'side-navigation-list-item-50337',
    )
    this.searchInputField = page.getByTestId('header-search-input')
    this.searchCategoryList = page.getByTestId('search-category-list').nth(1)
    this.searchSuggestionsItem = page.getByTestId('search-suggestions-item')
    this.searchDisplayAllResults = page.getByTestId('display-all-results')
    this.searchMobile = page.getByTestId('search-mobile')
    this.searchForm = page.getByTestId('search-form')
    this.mobileSidebar = page.getByTestId('mobile-sidebar')
    this.logoutButton = page.getByTestId('logout-button')
    this.mobileNavLinkMain = page.getByTestId('mobile-nav-link-main')
    this.mobileNavAccordion = page.getByTestId('mobile-nav-accordion')
    this.mobileNavigationItem = page.getByTestId('navigation-item')
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

  async openPlpMobile() {
    await this.sideNavigationButton.click()
    await this.mobileNavLinkMain.nth(1).click()
    await this.mobileNavAccordion.nth(0).click()
    await this.mobileNavigationItem.nth(0).click()
    await this.page.waitForLoadState('domcontentloaded')
  }
}
