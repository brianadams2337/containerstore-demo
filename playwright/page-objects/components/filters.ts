import type { Locator, Page } from '@playwright/test'
import { isMobile } from '../../support/utils'
import { expect } from '../../fixtures/fixtures'

export class Filters {
  readonly page: Page
  readonly closeFiltersButton: Locator
  readonly filterColorChip: Locator
  readonly filterSectionHeadline: Locator
  readonly filterApplyButton: Locator
  readonly filterResetButton: Locator
  readonly filterPriceInput: Locator
  readonly filterSizeCheckbox: Locator
  readonly filterFormCheckbox: Locator
  readonly filterGroupCounter: Locator
  readonly filterSaleSwitch: Locator
  readonly filterButton: Locator
  readonly filterToggleCounter: Locator

  constructor(page: Page) {
    this.page = page
    this.closeFiltersButton = page.getByTestId('close-filters')
    this.filterColorChip = page.getByTestId('filter-color-chip')
    this.filterSectionHeadline = page.getByTestId('headline')
    this.filterApplyButton = page.getByTestId('apply-filter-button')
    this.filterResetButton = page.getByTestId('reset-filter-button')
    this.filterPriceInput = page.getByTestId('price-input')
    this.filterSizeCheckbox = page.getByTestId('checkbox-chip')
    this.filterFormCheckbox = page.getByTestId('form-checkbox')
    this.filterGroupCounter = page.getByTestId('filter-group-counter')
    this.filterSaleSwitch = page.getByRole('switch')
    this.filterButton = page.getByTestId('filter-toggle-button')
    this.filterToggleCounter = page.getByTestId('filter-toggle-counter')
  }

  filterSizeCheckboxValue(value: number): Locator {
    return this.page.locator(
      `input[data-testid='checkbox-chip'][value="${value}"]`,
    )
  }

  async openFilters() {
    if (isMobile(this.page)) {
      await this.filterButton.nth(1).waitFor({ timeout: 2000 })
      await expect(this.filterButton.nth(1)).toBeVisible()
      await this.filterButton.nth(1).click()
    } else {
      await this.filterButton.nth(0).waitFor({ timeout: 2000 })
      await expect(this.filterButton.first()).toBeVisible()
      await this.filterButton.first().click()
    }
    await this.page.waitForLoadState('domcontentloaded')
  }
}
