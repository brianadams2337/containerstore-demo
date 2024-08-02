import { expect, test } from '../fixtures/fixtures'
import { plpFilterDeeplink, plpPath } from '../support/constants'

test('C2130727: Verify PLP Filters and Product Count', async ({
  homePage,
  mainNavigation,
  productListingPage,
  breadcrumb,
  plpFilters,
  toastMessage,
  page,
}) => {
  await homePage.visitPage()
  await mainNavigation.menuItemSecond.click()
  await productListingPage.menuRootCategory.first().click()
  await productListingPage.menuSubCategoryLvl1.first().click()
  await productListingPage.menuSubCategoryLvl2.first().click()

  const initialProductCount = breadcrumb.productCounter.textContent()

  await expect(productListingPage.filterButton.first()).toBeVisible()
  await expect(breadcrumb.productCounter).toBeVisible()
  await page.waitForLoadState('networkidle')
  await productListingPage.filterButton.first().click()

  await expect(plpFilters.filterSectionHeadline.first()).toBeVisible()
  await expect(plpFilters.closeFiltersButton).toBeVisible()

  await plpFilters.filterPriceFrom.fill('45')
  await plpFilters.filterPriceFrom.press('Enter')
  await plpFilters.filterPriceTo.fill('60')
  await plpFilters.filterPriceTo.press('Enter')
  await plpFilters.filterColorChip.first().click()
  await plpFilters.filterSizeCheckbox.first().check()

  const sizeFilterValue = await plpFilters.filterSizeCheckbox
    .first()
    .getAttribute('value')
  const colorFilterValue = await plpFilters.filterColorChip
    .first()
    .getAttribute('data-color-id')

  await plpFilters.filterApplyButton.click()

  await toastMessage.assertToastInfoIsVisible()
  await expect(plpFilters.closeFiltersButton).not.toBeVisible()
  await expect(productListingPage.filterButton.first()).toContainText('3')

  const pageUrl = page.url()

  expect(pageUrl).toContain('filters[minPrice]=4500&filters[maxPrice]=6000')
  expect(pageUrl).toContain(`filters[color]=${colorFilterValue}`)
  expect(pageUrl).toContain(`filters[size]=${sizeFilterValue}`)

  const filteredProductCount = breadcrumb.productCounter.textContent()
  expect(filteredProductCount).not.toBe(initialProductCount)

  await productListingPage.filterButton.first().click()
  await plpFilters.filterResetButton.click()
  await plpFilters.closeFiltersButton.click()

  await expect(productListingPage.filterButton.first()).not.toContainText('3')
})

test('C2139744: Verify PLP Filters deeplink', async ({
  productListingPage,
  plpFilters,
  page,
  baseURL,
}) => {
  await productListingPage.visitPlpWithFiltersUrl(
    plpPath,
    plpFilterDeeplink,
    baseURL as string,
  )
  await expect(productListingPage.filterButton.first()).toContainText('4')

  await page.waitForLoadState('networkidle')

  await productListingPage.filterButton.first().click()
  await expect(plpFilters.filterSectionHeadline.first()).toBeVisible()
  await expect(plpFilters.filterSizeCheckbox.nth(0)).toBeChecked()
  await expect(plpFilters.filterFormCheckbox.nth(0)).toBeChecked()
  await expect(plpFilters.filterFormCheckbox.nth(1)).toBeChecked()
})
