import { expect, test } from '../fixtures/fixtures'
import {
  PLP_FILTER_DEEPLINK,
  PLP_PATH_SUBCATEGORY_LVL_1,
  PLP_PATH_SUBCATEGORY_LVL_2,
  PLP_PATH_MAIN_CATEGORY,
  SORTING,
} from '../support/constants'
import { isMobile } from '../support/utils'

test.beforeEach(async ({ productListingPage, baseURL, countryDetector }) => {
  await productListingPage.visitPlpNoFilters(
    PLP_PATH_SUBCATEGORY_LVL_2,
    baseURL as string,
  )
  await countryDetector.closeModal()
})
test.setTimeout(45000)

test('C2130723: Verify PLP standard components', async ({
  productListingPage,
  breadcrumb,
  page,
  filters,
  sorting,
}) => {
  await expect(async () => {
    if (isMobile(page)) {
      await expect(filters.filterButton.nth(1)).toBeVisible()
    } else {
      await expect(sorting.sortDropdown.first()).toBeVisible()
      await expect(filters.filterButton.nth(0)).toBeVisible()
    }
    await expect(breadcrumb.breadcrumbCategoryLvl0).toBeVisible()
    await expect(breadcrumb.breadcrumbCategoryLvl1).toBeVisible()
    await expect(breadcrumb.breadcrumbCategoryActive).toBeVisible()
    await expect(productListingPage.productItem.first()).toBeVisible()

    await breadcrumb.clickBreadcrumbLvl1()
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

    if (isMobile(page)) {
      const subCategoryLvl2Text = await productListingPage
        .getProductLink(PLP_PATH_SUBCATEGORY_LVL_2)
        .nth(1)
        .textContent()
      const activeBreadcrumbText =
        await breadcrumb.breadcrumbCategoryActive.textContent()

      expect(activeBreadcrumbText?.toLowerCase()).toContain(
        subCategoryLvl2Text?.toLowerCase(),
      )
    } else {
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
    }
  }).toPass()
})

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
    await expect(async () => {
      await expect(breadcrumb.productCounter).toBeVisible()
      await filters.openFilters()
      await expect(filters.filterSectionHeadline.first()).toBeVisible()
      await expect(filters.closeFiltersButton).toBeVisible()
    }).toPass()
  })

  await test.step('Apply price filters', async () => {
    await expect(async () => {
      await filters.filterPriceInput.first().clear()
      await filters.filterPriceInput.first().fill('80')
      await filters.filterPriceInput.first().press('Enter')
      await filters.filterPriceInput.nth(1).clear()
      await filters.filterPriceInput.nth(1).fill('100')
      await filters.filterPriceInput.nth(1).press('Enter')
    }).toPass()
    await page.waitForTimeout(500)
    const currentProductCount = await breadcrumb.productCounter.textContent()
    expect(currentProductCount).not.toEqual(initialProductCount)
  })

  await test.step('Apply color and size filters', async () => {
    await expect(async () => {
      await filters.filterColorChip.first().scrollIntoViewIfNeeded()
      await page.waitForLoadState('domcontentloaded')
      await filters.filterColorChip.first().setChecked(true)
    }).toPass()

    await expect(async () => {
      await filters.filterSizeCheckbox.first().scrollIntoViewIfNeeded()
      await page.waitForLoadState('domcontentloaded')
      await filters.filterSizeCheckbox.first().setChecked(true)
      await expect(filters.filterGroupCounter.nth(2)).toBeVisible()
    }).toPass()

    const sizeFilterValue = await filters.filterSizeCheckbox
      .first()
      .getAttribute('value')
    const colorFilterValue = await filters.filterColorChip
      .first()
      .getAttribute('data-color-id')

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

    await expect(async () => {
      await filters.filterApplyButton.click()
      await toastMessage.assertToastInfoIsVisible()
      await expect(filters.closeFiltersButton).not.toBeVisible()
      await expect(filters.filterButton.first()).toContainText('3')
    }).toPass()

    await page.waitForLoadState('domcontentloaded')
    const pageUrl = page.url()

    expect(pageUrl).toContain('filters[minPrice]=8000&filters[maxPrice]=10000')
    expect(pageUrl).toContain(`filters[color]=${colorFilterValue}`)
    expect(pageUrl).toContain(`filters[size]=${sizeFilterValue}`)
  })

  await test.step('Reset filters', async () => {
    await filters.openFilters()

    await filters.filterResetButton.click()
    await filters.closeFiltersButton.click()
    await expect(filters.filterButton.first()).not.toContainText('3')
  })
})

test('C2139744: Verify PLP Filters deeplink', async ({
  productListingPage,
  filters,
  baseURL,
  countryDetector,
}) => {
  await productListingPage.visitPlpWithFiltersUrl(
    PLP_PATH_SUBCATEGORY_LVL_1,
    PLP_FILTER_DEEPLINK,
    baseURL as string,
  )
  await countryDetector.closeModal()
  await expect(filters.filterButton.first()).toContainText('3')
  await expect(async () => {
    await filters.openFilters()
    await filters.closeFiltersButton.waitFor()
  }).toPass()

  await expect(async () => {
    await filters.closeFiltersButton.waitFor()
    await expect(
      filters.filterSizeCheckboxValue(PLP_FILTER_DEEPLINK.size),
    ).toBeChecked()
    await expect(filters.filterSaleSwitch).toBeChecked()
  }).toPass()
})

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

test('C2141756: Verify PLP page title', async ({ breadcrumb, page }) => {
  await breadcrumb.breadcrumbCategoryLvl0.waitFor()
  const category = await breadcrumb.breadcrumbCategoryLvl0.textContent()
  const subCategory = await breadcrumb.breadcrumbCategoryLvl1.textContent()
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

  expect(pageTitle).toContain(
    `${category} - ${subCategory} - ${activeCategory}`,
  )
})

test('C2130729: Verify PLP Pagination', async ({
  productListingPage,
  baseURL,
  countryDetector,
  pagination,
}) => {
  await productListingPage.visitPlpNoFilters(
    PLP_PATH_MAIN_CATEGORY,
    baseURL as string,
  )
  await countryDetector.closeModal()

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

test('C2162468: Verify PLP Pagination setting filters', async ({
  productListingPage,
  baseURL,
  countryDetector,
  pagination,
  filters,
  page,
}) => {
  await productListingPage.visitPlpNoFilters(
    PLP_PATH_MAIN_CATEGORY,
    baseURL as string,
  )
  await countryDetector.closeModal()

  await test.step('Navigate to page 3 and set filter', async () => {
    await pagination.assertExactPageClick('3')
    await filters.openFilters()
    await page.waitForTimeout(300)

    await filters.filterPriceInput.nth(1).clear()
    await filters.filterPriceInput.nth(1).fill('100')
    await filters.filterPriceInput.nth(1).press('Enter')
    await page.waitForLoadState('domcontentloaded')

    await filters.filterApplyButton.click()
    await page.waitForLoadState('domcontentloaded')

    const pageUrl = page.url()
    expect(pageUrl).not.toContain('?page=')
  })
})

test('C2162411: Verify PLP Sorting', async ({
  productListingPage,
  baseURL,
  countryDetector,
  filters,
  page,
  sorting,
}) => {
  await productListingPage.visitPlpNoFilters(
    PLP_PATH_MAIN_CATEGORY,
    baseURL as string,
  )
  await countryDetector.closeModal()

  if (isMobile(page)) {
    await filters.filterButton.nth(1).click()
    await sorting.applySorting(SORTING.priceAsc, 1)
    await filters.closeFiltersButton.first().click()
  } else {
    await sorting.applySorting(SORTING.priceAsc, 0)
  }
  await page.waitForTimeout(500)
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
  await page.waitForTimeout(500)
  const pageUrl = page.url()
  expect(pageUrl).toContain(SORTING.priceDesc)
  const productIdPriceDesc = await productListingPage.productCard
    .first()
    .getAttribute('id')

  expect(productIdPriceAsc).not.toEqual(productIdPriceDesc)
})
