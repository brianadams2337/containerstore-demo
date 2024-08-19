import { expect, test } from '../fixtures/fixtures'
import {
  PLP_FILTER_DEEPLINK,
  PLP_PATH_SUBCATEGORY_LVL_1,
  PLP_PATH_SUBCATEGORY_LVL_2,
} from '../support/constants'

test.beforeEach(async ({ productListingPage, baseURL, page }) => {
  await productListingPage.visitPlpNoFilters(
    PLP_PATH_SUBCATEGORY_LVL_2,
    baseURL as string,
  )
  await page.waitForLoadState('networkidle')
})

test('C2130723: Verify PLP standard components', async ({
  productListingPage,
  breadcrumb,
  pagination,
}) => {
  await expect(productListingPage.sortDropdown).toBeVisible()
  await expect(productListingPage.filterButton.first()).toBeVisible()
  await expect(breadcrumb.breadcrumbCategoryLvl0).toBeVisible()
  await expect(breadcrumb.breadcrumbCategoryLvl1).toBeVisible()
  await expect(breadcrumb.breadcrumbCategoryActive).toBeVisible()
  await expect(productListingPage.productItem.first()).toBeVisible()

  await breadcrumb.clickBreadcrumbLvl1()
  await pagination.scrollToPagination()

  await expect(pagination.paginationButton.first()).toBeVisible()
  await expect(breadcrumb.productCounter).toBeVisible()
})

test('C2130725: Verify PLP breadcrumb', async ({
  productListingPage,
  breadcrumb,
  page,
}) => {
  await expect(breadcrumb.breadcrumbCategoryLvl1).toBeVisible()

  const subCategoryLvl2Text = await productListingPage.menuSubCategoryLvl2
    .first()
    .textContent()

  const activeBreadcrumbText =
    await breadcrumb.breadcrumbCategoryActive.textContent()

  expect(activeBreadcrumbText?.toLowerCase()).toContain(
    subCategoryLvl2Text?.toLowerCase(),
  )

  await productListingPage.menuSubCategoryLvl2.nth(0).click()

  if (subCategoryLvl2Text) {
    const currentUrl = page.url()

    expect(currentUrl).toContain(
      subCategoryLvl2Text.toLowerCase().replace(/ /g, '-'),
    )
  } else {
    throw new Error(
      'subCategoryLvl2Text is not available. Check the selector or webpage content.',
    )
  }
})

test('C2130727: Verify PLP Filters and Product Count', async ({
  productListingPage,
  breadcrumb,
  plpFilters,
  toastMessage,
  page,
}) => {
  const initialProductCount = breadcrumb.productCounter.textContent()

  await expect(productListingPage.filterButton.first()).toBeVisible()
  await expect(breadcrumb.productCounter).toBeVisible()
  await page.waitForLoadState('networkidle')
  await productListingPage.filterButton.first().click()

  await expect(plpFilters.filterSectionHeadline.first()).toBeVisible()
  await expect(plpFilters.closeFiltersButton).toBeVisible()

  await plpFilters.filterPriceFrom.fill('70')
  await plpFilters.filterPriceFrom.press('Enter')
  await plpFilters.filterPriceTo.fill('100')
  await plpFilters.filterPriceTo.press('Enter')
  await plpFilters.filterColorChip.first().setChecked(true)
  await page.waitForTimeout(2000)

  await plpFilters.filterSizeCheckbox.first().setChecked(true)
  await page.waitForLoadState('networkidle')

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

  expect(pageUrl).toContain('filters[minPrice]=7000&filters[maxPrice]=10000')
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
    PLP_PATH_SUBCATEGORY_LVL_1,
    PLP_FILTER_DEEPLINK,
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

test('C2130731: Verify PLP Add to Wishlist', async ({
  mainNavigation,
  productListingPage,
  header,
  page,
}) => {
  await mainNavigation.mainMenuCategoryClick(page)
  await productListingPage.menuRootCategory.first().click()

  await expect(productListingPage.productItem.first()).toBeVisible()
  await expect(productListingPage.wishlistButton.first()).toBeVisible()

  await productListingPage.addProductToWishlist()
  await expect(header.wishlistNumItems.first()).toHaveText('1')
  await expect(
    productListingPage.removeFromWishlistButton.first(),
  ).toBeVisible()

  await productListingPage.removeProductFromWishlist()
  await expect(header.wishlistNumItems.first()).not.toBeVisible()
  await expect(productListingPage.wishlistButton.first()).toBeVisible()
})
