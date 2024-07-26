import type { Locator, Page } from '@playwright/test'

export class Breadcrumb {
  readonly page: Page
  readonly breadcrumbCategoryLvl0: Locator
  readonly breadcrumbCategoryLvl1: Locator
  readonly breadcrumbCategoryActive: Locator
  readonly productCounter: Locator

  constructor(page: Page) {
    this.page = page
    this.breadcrumbCategoryLvl0 = page.getByTestId('category-breadcrumb-0')
    this.breadcrumbCategoryLvl1 = page.getByTestId('category-breadcrumb-1')
    this.breadcrumbCategoryActive = page.getByTestId(
      'active-category-breadcrumb',
    )
    this.productCounter = page.getByTestId('breadcrumb-product-counter')
  }

  async clickBreadcrumbLvl1() {
    await this.breadcrumbCategoryLvl1.click()
  }

  async clickBreadcrumbLvl0() {
    await this.breadcrumbCategoryLvl0.click()
  }
}
