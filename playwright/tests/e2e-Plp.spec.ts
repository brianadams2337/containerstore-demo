import { expect, test } from '../fixtures/fixtures'
import {
  PLP_FILTER_DEEP_LINK,
  SORTING,
  PLP_TEST_DATA,
} from '../support/constants'
import { isMobile, verifySeoMetaTags } from '../support/utils'

/**
 * @file Contains end-to-end tests for the Product Listing Page (PLP),
 * verifying its standard components, breadcrumb navigation, filtering,
 * adding to wishlist, product siblings, page title, pagination, sorting,
 * and SEO meta data.
 */

test.beforeEach(
  async ({
    countryDetector,
    homePage,
    page,
    mobileNavigation,
    mainNavigation,
  }) => {
    await homePage.visitPage()
    await page.waitForLoadState('networkidle')
    await countryDetector.closeModal()
    if (isMobile(page)) {
      await mobileNavigation.openPlpMobile()
    } else {
      await mainNavigation.navigateToPlpSubCategory()
    }
  },
)
test.setTimeout(45000)

/**
 * Verifies the visibility of standard components on the Product
 * Listing Page, including the sort dropdown (desktop), filter button, breadcrumb
 * elements (category levels and active category), product items, and the product counter.
 */
test('C2130723: Verify PLP standard components', async ({
  productListingPage,
  breadcrumb,
  page,
  filters,
  sorting,
}) => {
  if (isMobile(page)) {
    await expect(filters.filterButton.nth(1)).toBeVisible()
  } else {
    await expect(sorting.sortDropdown.first()).toBeVisible()
    await expect(filters.filterButton.nth(0)).toBeVisible()
  }
  await expect(breadcrumb.breadcrumbCategoryLvl0).toBeVisible()
  await expect(breadcrumb.breadcrumbCategoryActive).toBeVisible()
  await expect(productListingPage.productItem.first()).toBeVisible()
  await expect(breadcrumb.productCounter).toBeVisible()
})

/**
 * Verifies the visibility and content of the breadcrumb on the
 * sub-category PLP and checks if clicking the main category in the breadcrumb
 * navigates to the correct main category PLP with the correct URL structure.
 */
test('C2130725: Verify PLP breadcrumb', async ({ breadcrumb, page }) => {
  await test.step('Verify sub-category breadcrumb', async () => {
    await breadcrumb.productCounter.waitFor()
    const activeCategoryText =
      await breadcrumb.breadcrumbCategoryActive.textContent()
    await expect(breadcrumb.breadcrumbCategoryLvl0).toBeVisible()
    await expect(breadcrumb.breadcrumbCategoryActive).toBeVisible()
    await expect(breadcrumb.productCounter).toBeVisible()
    expect(page.url()).toContain(
      activeCategoryText?.toLowerCase().replace(/ \d+$/, '-'),
    )
  })
  await test.step('Verify main category breadcrumb', async () => {
    await breadcrumb.breadcrumbCategoryLvl0.click()
    await breadcrumb.productCounter.waitFor()
    await expect(breadcrumb.breadcrumbCategoryLvl0).not.toBeVisible()
    await expect(breadcrumb.productCounter).toBeVisible()
    const activeCategoryText =
      await breadcrumb.breadcrumbCategoryActive.textContent()
    expect(page.url()).toContain(
      activeCategoryText?.toLowerCase().replace(/ \d+$/, '-'),
    )
  })
})

/**
 * Verifies the initial state of the filters flyout, applies price,
 * color, and size filters, checks if the product count is updated correctly,
 * verifies the filter counter badge, and then resets the filters.
 */
test('C2130727: Verify PLP Filters and Product Count', async ({
  breadcrumb,
  filters,
  toastMessage,
  page,
}) => {
  const initialProductCountText = await breadcrumb.productCounter.textContent()
  let initialProductCount: number | null = null
  if (initialProductCountText) {
    initialProductCount = parseInt(initialProductCountText, 10)
  }
  await test.step('Verify initial state', async () => {
    await expect(breadcrumb.productCounter).toBeVisible()
    await filters.openFilters()
    await expect(filters.filterSectionHeadline.first()).toBeVisible()
    await expect(filters.closeFiltersButton).toBeVisible()
  })
  await test.step('Apply price filters', async () => {
    await filters.filterPriceInput.first().clear()
    await filters.filterPriceInput.first().focus()
    await filters.filterPriceInput.first().fill('80')
    await filters.filterPriceInput.first().press('Enter')
    await page.waitForTimeout(500)
    await filters.filterPriceInput.nth(1).clear()
    await filters.filterPriceInput.nth(1).focus()
    await filters.filterPriceInput.nth(1).fill('100')
    await filters.filterPriceInput.nth(1).press('Enter')
    await page.waitForTimeout(500)
    const currentProductCount = await breadcrumb.productCounter.textContent()
    expect(currentProductCount).not.toEqual(initialProductCount)
    expect(page.url()).toContain(
      'filters[minPrice]=8000&filters[maxPrice]=10000',
    )
  })
  await test.step('Apply color filter', async () => {
    const colorFilterValue = await filters.filterColorChip
      .first()
      .getAttribute('data-color-id')
    await filters.filterColorChip.first().scrollIntoViewIfNeeded()
    await page.waitForLoadState('domcontentloaded')
    await filters.filterColorChip.first().setChecked(true)
    await page.waitForTimeout(500)
    expect(page.url()).toContain(`filters[color]=${colorFilterValue}`)
  })
  await test.step('Apply size filter', async () => {
    const sizeFilterValue = await filters.filterSizeCheckbox
      .first()
      .getAttribute('value')
    await filters.filterSizeCheckbox.first().scrollIntoViewIfNeeded()
    await page.waitForLoadState('domcontentloaded')
    await filters.filterSizeCheckbox.first().setChecked(true)
    await page.waitForTimeout(500)
    expect(page.url()).toContain(`filters[size]=${sizeFilterValue}`)
  })
  await test.step('Check product counter', async () => {
    let currentProductCount: number | null = null
    const currentProductCountText =
      await breadcrumb.productCounter.textContent()
    const filteredButtonLabel = await filters.filterApplyButton.textContent()

    if (currentProductCountText) {
      currentProductCount = parseInt(currentProductCountText, 10)
    }
    if (filteredButtonLabel) {
      const regex = /\d+/g
      const match = filteredButtonLabel.match(regex)
      const counterFilterButton = match ? parseInt(match[0], 10) : null
      expect(currentProductCount).toEqual(counterFilterButton)
    }
    expect(currentProductCount).not.toEqual(initialProductCount)
  })
  await test.step('Apply filters and close the flyout', async () => {
    await filters.filterApplyButton.click()
    await page.waitForTimeout(500)
    await toastMessage.assertToastInfoIsVisible()
    await expect(filters.closeFiltersButton).not.toBeVisible()
    if (isMobile(page)) {
      await expect(filters.filterToggleCounter.nth(1)).toBeVisible()
    } else {
      await expect(filters.filterToggleCounter.nth(0)).toBeVisible()
    }
    await expect(filters.filterButton.first()).toContainText('3')
  })
  await test.step('Reset filters', async () => {
    await filters.openFilters()
    await filters.filterResetButton.click()
    await filters.closeFiltersButton.click()
    await page.waitForTimeout(500)
    await expect(filters.filterButton.first()).not.toContainText('3')
    if (isMobile(page)) {
      await expect(filters.filterToggleCounter.nth(1)).not.toBeVisible()
    } else {
      await expect(filters.filterToggleCounter.nth(0)).not.toBeVisible()
    }
  })
})

/**
 * Verifies that directly navigating to a PLP with predefined filters
 * in the URL (deeplink) correctly applies those filters, as indicated
 * by the filter counter and the checked state of the filter options.
 */
test('C2139744: Verify PLP Filters deeplink', async ({
  productListingPage,
  filters,
  countryDetector,
  mainNavigation,
  mobileNavigation,
  page,
  breadcrumb,
}) => {
  if (isMobile(page)) {
    await mobileNavigation.openPlpMobile()
  } else {
    await mainNavigation.navigateToPlpMainCategory()
  }
  await breadcrumb.breadcrumbCategoryActive.waitFor()
  await productListingPage.addFiltersToPLP(PLP_FILTER_DEEP_LINK)
  await countryDetector.closeModal()
  await expect(filters.filterButton.first()).toContainText('2')
  await filters.openFilters()
  await filters.closeFiltersButton.waitFor()
  await filters.closeFiltersButton.waitFor()
  await expect(filters.filterSaleSwitch).toBeChecked()
})

/**
 * Verifies that a user can add a product to their Wishlist by
 * clicking the wishlist button on the PLP product card, and that the
 * Wishlist item counter in the header is updated. It also verifies the
 * removal of the product from the Wishlist from the PLP, checking if
 * the counter and the button state are updated accordingly.
 */
test('C2130731: Verify PLP Add to Wishlist', async ({
  productListingPage,
  header,
}) => {
  await expect(productListingPage.productItem.first()).toBeVisible()
  await expect(productListingPage.wishlistButton.first()).toBeVisible()
  await test.step('Add product to Wishlist', async () => {
    await expect(async () => {
      await productListingPage.wishlistButton.first().waitFor()
      await productListingPage.addProductToWishlist()
      await header.wishlistNumItems.first().waitFor()
      await expect(header.wishlistNumItems.first()).toHaveText('1')
      await expect(
        productListingPage.removeFromWishlistButton.first(),
      ).toBeVisible()
    }).toPass()
  })
  await test.step('Remove product from Wishlist', async () => {
    await expect(async () => {
      await productListingPage.removeProductFromWishlist()
      await expect(header.wishlistNumItems.first()).not.toBeVisible()
      await expect(productListingPage.wishlistButton.first()).toBeVisible()
    }).toPass()
  })
})

/**
 * Verifies that hovering over a product tile on the PLP reveals
 * a product sibling, and clicking on that sibling navigates the user to
 * the correct URL for the sibling product.
 */
test('C2132074: Verify PLP Product siblings', async ({
  productListingPage,
  page,
}) => {
  await productListingPage.productTile.first().hover()
  await page.waitForLoadState('domcontentloaded')
  const productSiblingPath = (await productListingPage.productSibling
    .first()
    .getAttribute('href')) as string

  await productListingPage.productSibling.first().click()
  await page.waitForURL(productSiblingPath)

  const pageUrl = page.url()
  expect(pageUrl).toContain(productSiblingPath)
})

/**
 * Verifies that the page title of the Product Listing Page
 * correctly reflects the main category and the active sub-category.
 */
test('C2141756: Verify PLP page title', async ({ breadcrumb, page }) => {
  await breadcrumb.breadcrumbCategoryLvl0.waitFor()
  const category = await breadcrumb.breadcrumbCategoryLvl0.textContent()
  const breadrumbActive =
    await breadcrumb.breadcrumbCategoryActive.textContent()
  const productCounter = await breadcrumb.productCounter.textContent()

  const activeCategory =
    breadrumbActive !== null
      ? breadrumbActive
          .replace(new RegExp(productCounter as string, 'g'), '')
          .trim()
      : ''

  const pageTitle = await page.title()
  expect(pageTitle).toContain(`${category} - ${activeCategory}`)
})

/**
 * Verifies the initial state of the Previous and Next page
 * buttons in the pagination component, and then tests the navigation
 * functionality using these buttons to move between pages. It also
 * verifies navigation using direct page number buttons.
 *
 * Note: this test requires at least 3 pages of products in the PLP product stream.
 * If the default loaded PLP doesn't have it, you can modify the test and directly
 * open the PLP with minimum 3 pages.
 * If the test is not relevant, you can skip it by using `test.skip`. The rest of the tests
 * within this file will not be affected.
 */
test('C2130729: Verify PLP Pagination', async ({ pagination }) => {
  await test.step('Verify Previous/Next page buttons initial state', async () => {
    await pagination.assertPaginationInitialState()
  })
  await test.step('Verify page navigation using Previous/Next page buttons', async () => {
    await pagination.assertNextPageClick('2')
    await pagination.assertPreviousPageClick('1', true)
  })
  await test.step('Verify page navigation using exact page number pagination button', async () => {
    await pagination.assertExactPageClick('3')
  })
})

/**
 * Verifies that when filters are applied on a specific page
 * of the PLP (navigated to using pagination), the page URL does not
 * retain the pagination parameter, ensuring filters are applied to all
 * relevant products across all pages.
 *
 * Note: this test requires at least 2 pages of products in the PLP product stream.
 * If the default loaded PLP doesn't have it, you can modify the test and directly
 * open the PLP with minimum 2 pages.
 * If the test is not relevant, you can skip it by using `test.skip`. The rest of the tests
 * within this file will not be affected.
 */
test('C2162468: Verify PLP Pagination setting filters', async ({
  pagination,
  filters,
  page,
}) => {
  await pagination.assertExactPageClick('2')
  await filters.openFilters()
  await page.waitForTimeout(300)
  await filters.filterPriceInput.nth(1).clear()
  await filters.filterPriceInput.nth(1).focus()
  await filters.filterPriceInput.nth(1).fill('100')
  await filters.filterPriceInput.nth(1).press('Enter')
  await page.waitForLoadState('domcontentloaded')
  await filters.filterApplyButton.click()
  await page.waitForLoadState('domcontentloaded')
  await page.waitForTimeout(500)
  expect(page.url()).not.toContain('?page=')
})

/**
 * Verifies the sorting of products on the PLP by price, both
 * in ascending and descending order. It checks if the URL reflects the
 * applied sorting option and if the order of the first product card changes
 * after applying different sorting methods.
 */
test('C2162411: Verify PLP Sorting', async ({
  productListingPage,
  filters,
  page,
  sorting,
}) => {
  if (isMobile(page)) {
    await filters.filterButton.nth(1).click()
    await sorting.applySorting(SORTING.priceAsc, 1)
    await filters.closeFiltersButton.first().click()
  } else {
    await sorting.applySorting(SORTING.priceAsc, 0)
  }
  await page.waitForTimeout(1000)
  const pageUrlPriceAsc = page.url()
  expect(pageUrlPriceAsc).toContain(SORTING.priceAsc)
  const productIdPriceAsc = await productListingPage.productCard
    .first()
    .getAttribute('id')

  if (isMobile(page)) {
    await filters.filterButton.nth(1).click()
    await sorting.applySorting(SORTING.priceDesc, 1)
    await filters.closeFiltersButton.first().click()
  } else {
    await sorting.applySorting(SORTING.priceDesc, 0)
  }
  await page.waitForTimeout(1000)
  const pageUrl = page.url()
  expect(pageUrl).toContain(SORTING.priceDesc)
  const productIdPriceDesc = await productListingPage.productCard
    .first()
    .getAttribute('id')

  expect(productIdPriceAsc).not.toEqual(productIdPriceDesc)
})

/**
 * Verifies the SEO meta tags (robots and canonical) on the PLP
 * in its default state, after applying sorting, and after navigating to
 * the PLP with applied filters via a deeplink. It also checks if the main
 * headline (H1) contains the page title in the default state.
 */
test('C2139182: Verify PLP SEO data', async ({
  productListingPage,
  countryDetector,
  sorting,
  filters,
  page,
}) => {
  await test.step('Navigate to PLP and check default SEO data', async () => {
    await productListingPage.h1.waitFor()
    const pageTitle =
      (await productListingPage.pageTitle.textContent()) as string
    await expect(productListingPage.h1).toContainText(pageTitle)
    await verifySeoMetaTags(page, {
      robots: PLP_TEST_DATA.seoRobotsDefault,
      canonical: page.url(),
    })
  })
  await test.step('Apply Sorting and check SEO data', async () => {
    if (isMobile(page)) {
      await filters.filterButton.nth(1).click()
      await sorting.applySorting(SORTING.priceDesc, 1)
      await filters.closeFiltersButton.first().click()
    } else {
      await sorting.applySorting(SORTING.priceAsc, 0)
    }
    await page.waitForTimeout(500)
    await page.waitForLoadState('domcontentloaded')
    await verifySeoMetaTags(page, {
      robots: PLP_TEST_DATA.seoRobotsFiltersSorting,
    })
  })
  await test.step('Navigate to PLP with applied filters and check SEO data', async () => {
    await productListingPage.addFiltersToPLP(PLP_FILTER_DEEP_LINK)
    await countryDetector.closeModal()
    await productListingPage.h1.waitFor()
    await verifySeoMetaTags(page, {
      robots: PLP_TEST_DATA.seoRobotsFiltersSorting,
    })
  })
})
