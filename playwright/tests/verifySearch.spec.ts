import { expect, test } from '../fixtures/fixtures'
import { searchSuggestions } from '../support/constants'

test.beforeEach(async ({ homePage, page }) => {
  await homePage.visitPage()
  await page.waitForLoadState('networkidle')
})

test('C2139814: Verify Search no results page', async ({ search, page }) => {
  await search.executeSearch(searchSuggestions.searchTermNoResults)
  await page.waitForURL(searchSuggestions.searchUrl)

  const pageUrl = page.url()
  expect(pageUrl).toContain(
    searchSuggestions.searchParamUrl + searchSuggestions.searchTermNoResults,
  )
  await search.assertHeadlineSearchResults(
    searchSuggestions.searchTermNoResults,
    '0',
  )
})

test('C2130650: Verify Search results page', async ({ search, page }) => {
  await search.executeSearch(searchSuggestions.searchTermBrand)
  await page.waitForURL(searchSuggestions.searchUrl)

  const pageUrl = page.url()

  expect(pageUrl).toContain(
    searchSuggestions.searchParamUrl + searchSuggestions.searchTermBrand,
  )
  await expect(search.searchResultsProductImage.first()).toBeVisible()
  await search.assertHeadlineSearchResults(searchSuggestions.searchTermBrand)
})

test('C2130721: Verify Search suggestions', async ({ search }) => {
  await search.startTypingSearch(searchSuggestions.searchTermProduct)
  await search.assertSearchCategorySuggestions(
    searchSuggestions.searchTermProduct,
  )
})

test('C2132124: Verify Search suggestions "More" button', async ({
  search,
}) => {
  await search.startTypingSearch(searchSuggestions.searchTermProduct)
  await search.clickSearchMoreButton()

  await expect(search.searchResultsProductImage.first()).toBeVisible()
  await search.assertHeadlineSearchResults(searchSuggestions.searchTermProduct)
})

test('C2132173: Verify Search suggestions exact product match', async ({
  search,
  productDetailPage,
}) => {
  await search.startTypingSearch(searchSuggestions.searchExactProductID)
  await search.clickExactProductItem()

  await productDetailPage.productImage.first().waitFor({ state: 'visible' })
  await search.assertPdpIsLoaded()
})
