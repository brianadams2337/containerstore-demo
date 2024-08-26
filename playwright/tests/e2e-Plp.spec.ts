import { expect, test } from '../fixtures/fixtures'
import {
  PLP_FILTER_DEEPLINK,
  PLP_PATH_SUBCATEGORY_LVL_1,
  PLP_PATH_SUBCATEGORY_LVL_2,
  PLP_SIBLING_TEST_PRODUCT_PATH,
} from '../support/constants'

test.beforeEach(async ({ productListingPage, baseURL }) => {
  await productListingPage.visitPlpNoFilters(
    PLP_PATH_SUBCATEGORY_LVL_2,
    baseURL as string,
  )
})

test('C2130723: Verify PLP standard components', async ({
  productListingPage,
  breadcrumb,
  pagination,
}) => {
  await expect(async () => {
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
  }).toPass()
})

test('C2130725: Verify PLP breadcrumb', async ({
  productListingPage,
  breadcrumb,
  page,
}) => {
  await expect(async () => {
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
  }).toPass()
})

test('C2130727: Verify PLP Filters and Product Count', async ({
  productListingPage,
  breadcrumb,
  plpFilters,
  toastMessage,
  page,
}) => {
  const initialProductCount = breadcrumb.productCounter.textContent()

  await test.step('Verify initial state', async () => {
    await expect(async () => {
      await expect(productListingPage.filterButton.first()).toBeVisible()
      await expect(breadcrumb.productCounter).toBeVisible()
      await productListingPage.filterButton.first().click()

      await expect(plpFilters.filterSectionHeadline.first()).toBeVisible()
      await expect(plpFilters.closeFiltersButton).toBeVisible()
    }).toPass()
  })

  await test.step('Apply price filters', async () => {
    await expect(async () => {
      await plpFilters.filterPriceFrom.fill('80')
      await plpFilters.filterPriceFrom.press('Enter')
      await plpFilters.filterPriceTo.fill('100')
      await plpFilters.filterPriceTo.press('Enter')
    }).toPass()
  })

  await test.step('Apply color and size filters', async () => {
    await expect(async () => {
      await plpFilters.filterColorChip.first().scrollIntoViewIfNeeded()
      await plpFilters.filterColorChip.first().setChecked(true)
    }).toPass()

    await expect(async () => {
      await plpFilters.filterSizeCheckbox.first().scrollIntoViewIfNeeded()
      await plpFilters.filterSizeCheckbox.first().setChecked(true)
      await expect(plpFilters.filterGroupCounter.nth(2)).toBeVisible()
    }).toPass()

    const sizeFilterValue = await plpFilters.filterSizeCheckbox
      .first()
      .getAttribute('value')
    const colorFilterValue = await plpFilters.filterColorChip
      .first()
      .getAttribute('data-color-id')

    await expect(async () => {
      await plpFilters.filterApplyButton.click()
      await toastMessage.assertToastInfoIsVisible()
      await expect(plpFilters.closeFiltersButton).not.toBeVisible()
      await expect(productListingPage.filterButton.first()).toContainText('3')
    }).toPass()

    const pageUrl = page.url()

    expect(pageUrl).toContain('filters[minPrice]=8000&filters[maxPrice]=10000}')
    expect(pageUrl).toContain(`filters[color]=${colorFilterValue}`)
    expect(pageUrl).toContain(`filters[size]=${sizeFilterValue}`)
    const filteredProductCount = breadcrumb.productCounter.textContent()
    expect(filteredProductCount).not.toBe(initialProductCount)
  })

  await test.step('Reset filters', async () => {
    await productListingPage.filterButton.first().click()
    await plpFilters.filterResetButton.click()
    await plpFilters.closeFiltersButton.click()
    await expect(productListingPage.filterButton.first()).not.toContainText('3')
  })
})

test('C2139744: Verify PLP Filters deeplink', async ({
  productListingPage,
  plpFilters,
  baseURL,
}) => {
  await productListingPage.visitPlpWithFiltersUrl(
    PLP_PATH_SUBCATEGORY_LVL_1,
    PLP_FILTER_DEEPLINK,
    baseURL as string,
  )
  await expect(productListingPage.filterButton.first()).toContainText('4')
  await expect(async () => {
    await productListingPage.filterButton.first().click()
  }).toPass()

  await expect(plpFilters.filterSectionHeadline.first()).toBeVisible()
  await expect(plpFilters.filterSizeCheckbox.nth(0)).toBeChecked()
  await expect(plpFilters.filterFormCheckbox.nth(0)).toBeChecked()
  await expect(plpFilters.filterFormCheckbox.nth(1)).toBeChecked()
})

test('C2130731: Verify PLP Add to Wishlist', async ({
  mainNavigation,
  productListingPage,
  header,
}) => {
  await mainNavigation.mainMenuCategoryClick()
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

test('C2132074: Verify PLP Product siblings', async ({
  productListingPage,
  page,
}) => {
  await productListingPage.productTile.first().hover()
  await productListingPage.productSibling.nth(1).click()
  await page.waitForURL(PLP_SIBLING_TEST_PRODUCT_PATH)

  const pageUrl = page.url()
  const productPathString = PLP_SIBLING_TEST_PRODUCT_PATH.source.replace(
    /\\/g,
    '',
  )
  expect(pageUrl).toContain(productPathString)
})
