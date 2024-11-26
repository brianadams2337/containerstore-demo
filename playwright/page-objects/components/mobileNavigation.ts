import type { Locator, Page } from '@playwright/test'
import { expect } from '../../fixtures/fixtures'
import {
  PLP_SUBCATEGORY_NAME_DE,
  SEARCH_SUGGESTIONS,
} from '../../support/constants'

export class MobileNavigation {
  readonly page: Page
  readonly sideNavigationButton: Locator
  readonly mainCategoryMenuItem: Locator
  readonly subCategoryMenuItem: Locator
  readonly searchInputField: Locator
  readonly exactProductItem: Locator
  readonly searchCategoryList: Locator
  readonly searchMoreButton: Locator
  readonly productListItem: Locator

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
    this.exactProductItem = page.getByTestId('search-exact-product-item')
    this.searchMoreButton = page.getByRole('link', {
      name: SEARCH_SUGGESTIONS.moreButtonLabelDE,
    })
    this.productListItem = page.getByTestId('search-exact-product-item')
  }

  async executeMobileSearch(searchTerm: string) {
    await this.sideNavigationButton.click()
    await this.searchInputField.fill(searchTerm)
    await this.searchInputField.press('Enter')
  }

  async startTypingMobileSearch(searchTerm: string, exactProduct: boolean) {
    await this.sideNavigationButton.click()
    await this.searchInputField.first().fill(searchTerm)
    if (exactProduct === true) {
      await expect(this.exactProductItem).toBeVisible()
    }
  }

  async clickSearchMoreButtonMobile() {
    await this.searchMoreButton.waitFor()
    await this.searchMoreButton.click()
  }
}
