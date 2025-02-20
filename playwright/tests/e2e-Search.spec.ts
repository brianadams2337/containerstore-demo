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
      await mobileNavigation.searchSuggestionsItem.click()
    } else {
      await search.startTypingSearch(SEARCH_SUGGESTIONS.searchTermProduct)
      await search.searchSuggestionsItem.first().click()
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
      await mobileNavigation.searchSuggestionsItem.click()
      await mobileNavigation.sideNavigationButton.click()
      await page.waitForLoadState('networkidle')
    } else {
      await search.startTypingSearch(SEARCH_SUGGESTIONS.searchExactProductID)
      await search.clickExactProductItem()
    }
    await page.waitForTimeout(500)
    await search.assertUrlIsLoaded(SEARCH_SUGGESTIONS.pdpUrl)
  }).toPass()
})

test('C2140718: Verify Search results page Filters ', async ({
  search,
  page,
  mobileNavigation,
  filters,
}) => {
  await test.step('Search for a term and check Filter initial state', async () => {
    if (isMobile(page)) {
      await mobileNavigation.executeMobileSearch(
        SEARCH_SUGGESTIONS.searchTermBrand,
      )
    } else {
      await search.executeSearch(SEARCH_SUGGESTIONS.searchTermBrand)
    }
    await page.waitForURL(SEARCH_SUGGESTIONS.searchUrl)
    await expect(filters.filterToggleCounter).not.toBeVisible()
  })
  await test.step('Apply price filter and check filter counter', async () => {
    await filters.openFilters()
    await page.waitForTimeout(500)
    await filters.closeFiltersButton.waitFor()
    await expect(filters.closeFiltersButton).toBeVisible()
    await filters.filterPriceInput.nth(1).focus()
    await filters.filterPriceInput.nth(1).clear()
    await filters.filterPriceInput.nth(1).fill('100')
    await filters.filterPriceInput.nth(1).press('Enter')
    await page.waitForTimeout(500)
    await filters.filterApplyButton.click()
    await page.waitForTimeout(500)
    await expect(filters.filterToggleCounter.first()).toHaveText('1')
  })
  await test.step('Apply color filter and check filter counter', async () => {
    await filters.openFilters()
    await page.waitForTimeout(500)
    await filters.filterColorChip.first().scrollIntoViewIfNeeded()
    await page.waitForLoadState('domcontentloaded')
    await filters.filterColorChip.first().setChecked(true)
    await page.waitForTimeout(1000)
    await filters.filterApplyButton.scrollIntoViewIfNeeded()
    await filters.filterApplyButton.click()
    await page.waitForTimeout(1000)
    if (isMobile(page)) {
      await expect(filters.filterToggleCounter.nth(1)).toBeVisible()
    } else {
      await expect(filters.filterToggleCounter.nth(0)).toBeVisible()
    }
    await expect(filters.filterToggleCounter.first()).toHaveText('2')
  })
  await test.step('Reset filters and check filter counter', async () => {
    await filters.openFilters()
    await page.waitForTimeout(1000)
    await filters.filterResetButton.scrollIntoViewIfNeeded()
    await filters.filterResetButton.click()
    await page.waitForLoadState('domcontentloaded')
    await filters.closeFiltersButton.click()
    await page.waitForTimeout(1000)
    await expect(filters.filterToggleCounter.first()).not.toBeVisible()
  })
})

test('C2162007: Verify Search suggestions tags', async ({
  search,
  page,
  mobileNavigation,
  filters,
}) => {
  await expect(async () => {
    if (isMobile(page)) {
      await mobileNavigation.startTypingMobileSearch(
        SEARCH_SUGGESTIONS.searchTermTags,
        false,
      )
      await page.waitForLoadState('networkidle')
    } else {
      await search.startTypingSearch(SEARCH_SUGGESTIONS.searchTermTags)
    }
    await expect(search.searchSuggestionsTagGroup.first()).toBeVisible()
    await expect(
      search.searchSuggestionTag(SEARCH_SUGGESTIONS.searchTestTagValue).first(),
    ).toBeVisible()
    await search.searchSuggestionsItem.first().click()
    await page.waitForLoadState('domcontentloaded')
    await expect(filters.filterToggleCounter.first()).toHaveText('1')
  }).toPass()
})

test('C2170825 Verify Search returns PDP on exact product ID pressing Enter', async ({
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
      await mobileNavigation.searchInputField.nth(0).press('Enter')
      await mobileNavigation.sideNavigationButton.click()
      await page.waitForLoadState('networkidle')
    } else {
      await search.startTypingSearch(SEARCH_SUGGESTIONS.searchExactProductID)
      await search.searchInput.nth(1).press('Enter')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(500)
    }
    await search.assertUrlIsLoaded(SEARCH_SUGGESTIONS.pdpUrl)
  }).toPass()
})

test('C2171030 Verify Search returns matching page', async ({
  search,
  page,
  mobileNavigation,
}) => {
  await expect(async () => {
    if (isMobile(page)) {
      await mobileNavigation.startTypingMobileSearch(
        SEARCH_SUGGESTIONS.searchTermPage,
        false,
      )
      await mobileNavigation.searchInputField.nth(0).press('Enter')
      await mobileNavigation.sideNavigationButton.click()
      await page.waitForLoadState('networkidle')
    } else {
      await search.startTypingSearch(SEARCH_SUGGESTIONS.searchTermPage)
      await search.searchInput.nth(1).press('Enter')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(500)
    }
    await search.assertUrlIsLoaded(SEARCH_SUGGESTIONS.faqPageUrl)
  }).toPass()
})

test('C2171031 Verify Search returns product for matching Reference Key', async ({
  search,
  page,
  mobileNavigation,
}) => {
  await expect(async () => {
    if (isMobile(page)) {
      await mobileNavigation.startTypingMobileSearch(
        SEARCH_SUGGESTIONS.searchReferenceKey,
        true,
      )
      await mobileNavigation.searchInputField.nth(0).press('Enter')
      await mobileNavigation.sideNavigationButton.click()
      await page.waitForLoadState('networkidle')
    } else {
      await search.startTypingSearch(SEARCH_SUGGESTIONS.searchReferenceKey)
      await search.searchInput.nth(1).press('Enter')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(500)
    }
    await search.assertUrlIsLoaded(SEARCH_SUGGESTIONS.pdpUrl)
  }).toPass()
})
