import { expect, test } from '../fixtures/fixtures'
import { SEARCH_SUGGESTIONS } from '../support/constants'

test.beforeEach(async ({ homePage, page }) => {
  await homePage.visitPage()
  await page.waitForLoadState('networkidle')
})

test('C2139814: Verify Search no results page', async ({ search, page }) => {
  await expect(async () => {
    await search.executeSearch(SEARCH_SUGGESTIONS.searchTermNoResults)
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

test('C2130650: Verify Search results page', async ({ search, page }) => {
  await expect(async () => {
    await search.executeSearch(SEARCH_SUGGESTIONS.searchTermBrand)
    await page.waitForURL(SEARCH_SUGGESTIONS.searchUrl)

    const pageUrl = page.url()

    expect(pageUrl).toContain(
      SEARCH_SUGGESTIONS.searchParamUrl + SEARCH_SUGGESTIONS.searchTermBrand,
    )
    await expect(search.searchResultsProductImage.first()).toBeVisible()
    await search.assertHeadlineSearchResults(SEARCH_SUGGESTIONS.searchTermBrand)
  }).toPass()
})

test('C2130721: Verify Search suggestions', async ({ search }) => {
  await expect(async () => {
    await search.startTypingSearch(SEARCH_SUGGESTIONS.searchTermProduct)
    await search.assertSearchCategorySuggestions(
      SEARCH_SUGGESTIONS.searchTermProduct,
    )
  }).toPass()
})

test('C2132124: Verify Search suggestions "More" button', async ({
  search,
}) => {
  await expect(async () => {
    await search.startTypingSearch(SEARCH_SUGGESTIONS.searchTermProduct)
    await search.clickSearchMoreButton()

    await expect(search.searchResultsProductImage.first()).toBeVisible()
    await search.assertHeadlineSearchResults(
      SEARCH_SUGGESTIONS.searchTermProduct,
    )
  }).toPass()
})

test('C2132173: Verify Search suggestions exact product match', async ({
  search,
  productDetailPage,
}) => {
  await expect(async () => {
    await search.startTypingSearch(SEARCH_SUGGESTIONS.searchExactProductID)
    await search.clickExactProductItem()

    await productDetailPage.productImage.first().waitFor({ state: 'visible' })
    await search.assertPdpIsLoaded()
  }).toPass()
})
