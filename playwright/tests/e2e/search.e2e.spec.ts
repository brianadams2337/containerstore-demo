import { test } from '../../fixtures/fixtures'
import { expect } from '@playwright/test'
import { SEARCH } from '../../support/constants'
import { isMobile } from '../../support/utils'

test.beforeEach(async ({ homePage, page, countryDetector }) => {
  await homePage.visitPage()
  await page.waitForLoadState('networkidle')
  await countryDetector.closeModal()
})

/**
 * Verifies that when a search term with no matching results is entered,
 * the user is navigated to a no results page with the correct URL and headline
 * that contains entered search term.
 */
test('C2139814: Verify Search no results page', async ({
  search,
  page,
  mobileNavigation,
}) => {
  await expect(async () => {
    if (isMobile(page)) {
      await mobileNavigation.executeMobileSearch('noresultstest')
    } else {
      await search.executeSearch('noresultstest')
    }

    await page.waitForLoadState('domcontentloaded')
    await search.h1.first().waitFor()

    expect(page.url()).toContain(`${SEARCH.searchParamUrl}noresultstest`)
    await search.assertHeadlineSearchResults('noresultstest')
  }).toPass()
})

/**
 * Verifies that when a valid product search term is entered,
 * the user is navigated to a search results page that contains returned products.
 * `SEARCH.searchTermProduct` should be defined via environment variable `E2E_SEARCH_TERM_PRODUCT`,
 * and it should contain the value that doesn't match any category name, so the search suggestions are not shown.
 * Recommended search term value for this test case is some product brand.
 */
test('C2130650: Verify Search results page', async ({
  search,
  page,
  mobileNavigation,
}) => {
  await expect(async () => {
    if (isMobile(page)) {
      await mobileNavigation.executeMobileSearch(SEARCH.searchTermProduct)
    } else {
      await search.executeSearch(SEARCH.searchTermProduct)
    }
    await search.h1.first().waitFor()
    expect(page.url()).toContain(
      SEARCH.searchParamUrl + SEARCH.searchTermProduct,
    )
    await expect(search.searchResultsProductImage.first()).toBeVisible()
    await search.assertHeadlineSearchResults(SEARCH.searchTermProduct)
  }).toPass()
})

/**
 * Verifies that when typing a category-related search term,
 * relevant suggestions appear and clicking a suggestion navigates to the correct PLP.
 * `SEARCH.searchTermCategorySuggestion` should be defined via environment variable `E2E_SEARCH_TERM_CATEGORY_SUGGESTION`,
 * and it should contain the value that matches some category name.
 * As an example, the search term for this test can be "shirts".
 */
test('C2130721: Verify Search suggestions', async ({
  search,
  mobileNavigation,
  page,
  productListingPage,
}) => {
  await expect(async () => {
    if (isMobile(page)) {
      await mobileNavigation.startTypingMobileSearch(
        SEARCH.searchTermCategorySuggestion,
      )
      await mobileNavigation.searchSuggestionsItem.first().click()
    } else {
      await search.startTypingSearch(SEARCH.searchTermCategorySuggestion)
      await search.searchSuggestionsItem.first().click()
    }
    await productListingPage.h1.waitFor()
    expect(page.url()).toContain(SEARCH.searchTermCategorySuggestion)
  }).toPass()
})

/**
 * Verifies that when typing a search term with suggestions, clicking the
 * "See all results" button navigates to the search results page
 * with visible product stream and headline containing the search term.
 * `SEARCH.searchTermCategorySuggestion` should be defined via environment variable `E2E_SEARCH_TERM_CATEGORY_SUGGESTION`,
 * and it should contain the value that matches some category name.
 * As an example, the search term for this test can be "shirts".
 */
test('C2132124: Verify Search suggestions "See all results" button', async ({
  search,
  mobileNavigation,
  page,
}) => {
  await expect(async () => {
    if (isMobile(page)) {
      await mobileNavigation.startTypingMobileSearch(
        SEARCH.searchTermCategorySuggestion,
      )
      await mobileNavigation.clickSearchMoreButtonMobile()
    } else {
      await search.startTypingSearch(SEARCH.searchTermCategorySuggestion)
      await search.clickSearchMoreButton()
    }
    await expect(search.searchResultsProductImage.first()).toBeVisible()
    await search.assertHeadlineSearchResults(
      SEARCH.searchTermCategorySuggestion,
    )
  }).toPass()
})

/**
 * Verifies that when typing an exact product ID,
 * a suggestion appears, and clicking it navigates directly to the product detail page (PDP).
 * `SEARCH.searchExactProductID` should be defined via environment variable `E2E_SEARCH_EXACT_PRODUCT_ID`,
 * and it should contain the exact value of any product ID, e.g. 123456.
 */
test('C2132173: Verify Search suggestions exact product match', async ({
  search,
  page,
  mobileNavigation,
}) => {
  await expect(async () => {
    if (isMobile(page)) {
      await mobileNavigation.startTypingMobileSearch(
        SEARCH.searchExactProductID,
      )
      await mobileNavigation.searchSuggestionsItem.click()
      await mobileNavigation.sideNavigationButton.click()
      await page.waitForLoadState('networkidle')
    } else {
      await search.startTypingSearch(SEARCH.searchExactProductID)
      await search.clickExactProductItem()
    }
    await page.waitForTimeout(500)
    await search.assertUrlIsLoaded(SEARCH.searchExactProductID)
  }).toPass()
})

/**
 * Verifies the initial state of filters on the search results page,
 * applies a price filter, checks the filter counter, applies a color filter,
 * checks the updated filter counter, and then resets the filters.
 * `SEARCH.searchTermProduct` should be defined via environment variable `E2E_SEARCH_TERM_PRODUCT`,
 * and it should contain the value that doesn't match any category name, so the search suggestions are not shown.
 * Recommended search term value for this test case is some product brand.
 */
test('C2140718: Verify Search results page Filters ', async ({
  search,
  page,
  mobileNavigation,
  filters,
  productListingPage,
}) => {
  await test.step('Search for a term and check Filter initial state', async () => {
    if (isMobile(page)) {
      await mobileNavigation.executeMobileSearch(SEARCH.searchTermProduct)
    } else {
      await search.executeSearch(SEARCH.searchTermProduct)
    }
    await productListingPage.h1.waitFor()
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

/**
 * Verifies that when typing a search term that matches tags,
 * relevant tags are displayed in the suggestions, and clicking a tag
 * applies a corresponding filter.
 * `SEARCH.searchTermTags` should be defined via environment variable `E2E_SEARCH_TAGS`,
 * and it should contain the value that describes the product and its attributes,
 * for example "black shoes size 44".
 */
test('C2162007: Verify Search suggestions tags', async ({
  search,
  page,
  mobileNavigation,
  filters,
}) => {
  await expect(async () => {
    if (isMobile(page)) {
      await mobileNavigation.startTypingMobileSearch(SEARCH.searchTermTags)
      await page.waitForLoadState('networkidle')
    } else {
      await search.startTypingSearch(SEARCH.searchTermTags)
    }
    await expect(search.searchSuggestionsTagGroup.first()).toBeVisible()
    await search.searchSuggestionsItem.first().click()
    await page.waitForLoadState('domcontentloaded')
    await expect(filters.filterToggleCounter.first()).toHaveText('1')
  }).toPass()
})

/**
 * Verifies that when an exact product ID is entered into the
 * search input and Enter is pressed, the user is redirected to the
 * corresponding Product Detail Page (PDP).
 * `SEARCH.searchExactProductID` should be defined via environment variable `E2E_SEARCH_EXACT_PRODUCT_ID`,
 * and it should contain the exact value of any product ID, e.g. 123456.
 */
test('C2170825 Verify Search returns PDP on exact product ID pressing Enter', async ({
  search,
  page,
  mobileNavigation,
  productListingPage,
}) => {
  await expect(async () => {
    if (isMobile(page)) {
      await mobileNavigation.startTypingMobileSearch(
        SEARCH.searchExactProductID,
      )
      await mobileNavigation.searchInputField.nth(0).press('Enter')
      await mobileNavigation.sideNavigationButton.click()
      await page.waitForLoadState('networkidle')
    } else {
      await search.startTypingSearch(SEARCH.searchExactProductID)
      await search.searchInput.nth(1).press('Enter')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(500)
    }
    await productListingPage.h1.waitFor()
    await search.assertUrlIsLoaded(SEARCH.searchExactProductID)
  }).toPass()
})

/**
 * Verifies that when a search term that matches the title or
 * keywords of a static page is entered and Enter is pressed, the user
 * is navigated to that matching page.
 * `SEARCH.searchTermPage` should be defined via environment variable `E2E_SEARCH_PAGE`,
 * and it should contain the value that fully or partially matches a content page that can be searched, e.g. "faq" or "support".
 */
test('C2171030 Verify Search returns matching page', async ({
  search,
  page,
  mobileNavigation,
}) => {
  await expect(async () => {
    if (isMobile(page)) {
      await mobileNavigation.startTypingMobileSearch(SEARCH.searchTermPage)
      await mobileNavigation.searchInputField.nth(0).press('Enter')
      await mobileNavigation.sideNavigationButton.click()
      await page.waitForLoadState('networkidle')
    } else {
      await search.startTypingSearch(SEARCH.searchTermPage)
      await search.searchInput.nth(1).press('Enter')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(500)
    }
    await search.assertUrlIsLoaded(SEARCH.searchTermPage)
  }).toPass()
})

/**
 * Verifies that when a valid Reference Key of a product is
 * entered into the search input and Enter is pressed, the user is
 * redirected to the corresponding Product Detail Page (PDP).
 * `SEARCH.searchReferenceKey` should be defined via environment variable `E2E_SEARCH_REFERENCE_KEY`,
 * and it should contain the exact value of product reference key, e.g. "111-ref-key".
 */
test('C2171031 Verify Search returns product for matching Reference Key', async ({
  search,
  page,
  mobileNavigation,
}) => {
  await expect(async () => {
    if (isMobile(page)) {
      await mobileNavigation.startTypingMobileSearch(SEARCH.searchReferenceKey)
      await mobileNavigation.searchInputField.nth(0).press('Enter')
      await mobileNavigation.sideNavigationButton.click()
      await page.waitForLoadState('networkidle')
    } else {
      await search.startTypingSearch(SEARCH.searchReferenceKey)
      await search.searchInput.nth(1).press('Enter')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(500)
    }
    await search.assertUrlIsLoaded('/p/')
  }).toPass()
})
