import { expect, test } from '../fixtures/fixtures'
import { SEARCH_SUGGESTIONS } from '../support/constants'
import { isMobile } from '../support/utils'

test.beforeEach(async ({ homePage, page, countryDetector }) => {
  await homePage.visitPage()
  await page.waitForLoadState('networkidle')
  await countryDetector.closeModal()
})

test('C2139814: Verify Search no results page', async ({
  search,
  page,
  mobileNavigation,
}) => {
  await expect(async () => {
    if (isMobile(page)) {
      await mobileNavigation.executeMobileSearch(
        SEARCH_SUGGESTIONS.searchTermNoResults,
      )
    } else {
      await search.executeSearch(SEARCH_SUGGESTIONS.searchTermNoResults)
    }
    await page.waitForURL(SEARCH_SUGGESTIONS.searchUrl)

    const pageUrl = page.url()
    expect(pageUrl).toContain(
      SEARCH_SUGGESTIONS.searchParamUrl +
        SEARCH_SUGGESTIONS.searchTermNoResults,
    )
    await search.assertHeadlineSearchResults(
      SEARCH_SUGGESTIONS.searchTermNoResults,
      '0',
    )
  }).toPass()
})

test('C2130650: Verify Search results page', async ({
  search,
  page,
  mobileNavigation,
}) => {
  await expect(async () => {
    if (isMobile(page)) {
      await mobileNavigation.executeMobileSearch(
        SEARCH_SUGGESTIONS.searchTermBrand,
      )
    } else {
      await search.executeSearch(SEARCH_SUGGESTIONS.searchTermBrand)
    }
    await page.waitForURL(SEARCH_SUGGESTIONS.searchUrl)

    const pageUrl = page.url()

    expect(pageUrl).toContain(
      SEARCH_SUGGESTIONS.searchParamUrl + SEARCH_SUGGESTIONS.searchTermBrand,
    )
    await expect(search.searchResultsProductImage.first()).toBeVisible()
    await search.assertHeadlineSearchResults(SEARCH_SUGGESTIONS.searchTermBrand)
  }).toPass()
})

test('C2130721: Verify Search suggestions', async ({
  search,
  mobileNavigation,
  page,
}) => {
  await expect(async () => {
    if (isMobile(page)) {
      await mobileNavigation.startTypingMobileSearch(
        SEARCH_SUGGESTIONS.searchTermProduct,
        false,
      )
      await mobileNavigation.exactProductItem.click()
    } else {
      await search.startTypingSearch(SEARCH_SUGGESTIONS.searchTermProduct)
      await search.searchCategoryListItem.first().click()
    }
    await search.assertSearchCategorySuggestions(
      SEARCH_SUGGESTIONS.searchTermProduct,
    )
  }).toPass()
})

test('C2132124: Verify Search suggestions "See all results" button', async ({
  search,
  mobileNavigation,
  page,
}) => {
  await expect(async () => {
    if (isMobile(page)) {
      await mobileNavigation.startTypingMobileSearch(
        SEARCH_SUGGESTIONS.searchTermProduct,
        false,
      )
      await mobileNavigation.clickSearchMoreButtonMobile()
    } else {
      await search.startTypingSearch(SEARCH_SUGGESTIONS.searchTermProduct)
      await search.clickSearchMoreButton()
    }
    await expect(search.searchResultsProductImage.first()).toBeVisible()
    await search.assertHeadlineSearchResults(
      SEARCH_SUGGESTIONS.searchTermProduct,
    )
  }).toPass()
})

test('C2132173: Verify Search suggestions exact product match', async ({
  search,
  page,
  mobileNavigation,
}) => {
  await expect(async () => {
    if (isMobile(page)) {
      await mobileNavigation.startTypingMobileSearch(
        SEARCH_SUGGESTIONS.searchExactProductID,
        true,
      )
      await mobileNavigation.productListItem.click()
      await mobileNavigation.sideNavigationButton.click()
      await page.waitForLoadState('networkidle')
    } else {
      await search.startTypingSearch(SEARCH_SUGGESTIONS.searchExactProductID)
      await search.clickExactProductItem()
    }
    await search.assertPdpIsLoaded()
  }).toPass()
})

test('C2140718: Verify Search results page Filters ', async ({
  search,
  page,
  mobileNavigation,
  filters,
}) => {
  await test.step('Search for a term and check Filter initial state', async () => {
    await expect(async () => {
      if (isMobile(page)) {
        await mobileNavigation.executeMobileSearch(
          SEARCH_SUGGESTIONS.searchTermBrand,
        )
      } else {
        await search.executeSearch(SEARCH_SUGGESTIONS.searchTermBrand)
      }
      await page.waitForURL(SEARCH_SUGGESTIONS.searchUrl)
      await expect(filters.filterToggleCounter).not.toBeVisible()
    }).toPass()
  })

  await test.step('Apply filters and check filter counter', async () => {
    await expect(async () => {
      await filters.openFilters()
      await expect(filters.closeFiltersButton).toBeVisible()
      await filters.filterPriceInput.nth(1).clear()
      await filters.filterPriceInput.nth(1).fill('100')
      await filters.filterPriceInput.nth(1).press('Enter')
      await filters.filterColorChip.first().scrollIntoViewIfNeeded()
      await page.waitForLoadState('domcontentloaded')
      await filters.filterColorChip.first().setChecked(true)
      await filters.filterApplyButton.click()
      await expect(filters.filterToggleCounter.first()).toHaveText('2')
    }).toPass()
  })

  await test.step('Reset filters and check filter counter', async () => {
    await expect(async () => {
      await filters.openFilters()
      await filters.filterResetButton.click()
      await page.waitForLoadState('domcontentloaded')
      await expect(filters.filterToggleCounter.first()).not.toBeVisible()
    }).toPass()
  })
})
