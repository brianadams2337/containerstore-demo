import { expect, test } from '../fixtures/fixtures'
import { getAllLinksFromPage, isMobile } from '../support/utils'
import { ROUTES } from '../support/constants'

/**
 * @file Contains end-to-end tests for the homepage, verifying its basic structure,
 * links integrity, and accessibility skip links.
 */

test.beforeEach(async ({ homePage, countryDetector, page }) => {
  await homePage.visitPage()
  await page.waitForLoadState('domcontentloaded')
  await countryDetector.closeModal()
})

/**
 * Verifies that the main content area of the homepage,
 * the main header, and the footer are visible upon page load.
 */
test('C2141227 Verify Homepage sections', async ({
  homePage,
  header,
  footer,
}) => {
  await expect(async () => {
    await homePage.homepageContent.waitFor()
    await expect(header.mainHeader).toBeVisible()
    await expect(footer.footerWrapper).toBeVisible()
  }).toPass()
})

/**
 * - Verifies that all links on the homepage return a successful
 * HTTP status code (less than 400). It first attempts a HEAD request for
 * efficiency and falls back to a full page navigation if the HEAD request fails.
 * - Verifies the status code of homepage links.
 * - Handles potential errors during link checks.
 * - Attempts full navigation as a fallback for HEAD failures.
 * - Ensures links are valid and do not lead to broken pages.
 */
test('C2141228 C2138940 C2138941 C2138942 C2143604 Verify Homepage links', async ({
  page,
  context,
}) => {
  test.setTimeout(60000)
  const linkUrls = await getAllLinksFromPage(page)

  for (const url of linkUrls) {
    await test.step(`Checking link: ${url}`, async () => {
      try {
        const response = await page.request.head(url)
        expect(response.status()).toBeLessThan(400)
        expect(response.statusText()).toBe('OK')
      } catch (error) {
        console.warn(
          `HEAD request failed for ${url}, attempting full page navigation.`,
        )
        console.error('Error details:', error)
        try {
          const newPage = await context.newPage()
          await newPage.goto(url)
          await newPage.waitForLoadState('networkidle')
          await newPage.close()
        } catch (navError) {
          console.error(`[Error] Navigation failed for ${url}:`, navError)
          throw new Error(`Both HEAD request and navigation failed for ${url}`)
        }
      }
    })
  }
})

/**
 * Verifies the functionality of the "Skip to Main Content" and
 * "Skip to Search" accessibility links, ensuring they correctly focus
 * the intended elements on the page for keyboard navigation.
 */
test('C2167297 Verify Homepage Skip Links', async ({
  homePage,
  skipLinks,
  page,
  search,
  mobileNavigation,
  countryDetector,
}) => {
  await test.step('Verify Skip to Main Content', async () => {
    await homePage.homepageContent.press('Tab')
    await skipLinks.buttonSkipToMain.waitFor()
    await expect(skipLinks.buttonSkipToMain).toBeVisible()
    await skipLinks.buttonSkipToMain.focus()
    await skipLinks.buttonSkipToMain.press('Enter')
    await expect(homePage.homepageMainContent).toBeFocused()
  })
  await test.step('Verify Skip to Search', async () => {
    await page.reload()
    await page.waitForLoadState('domcontentloaded')
    await countryDetector.closeModal()
    await homePage.homepageContent.press('Tab')
    await skipLinks.buttonSkipToSearch.waitFor()
    await skipLinks.buttonSkipToSearch.focus()
    await page.waitForLoadState('networkidle')
    await skipLinks.buttonSkipToSearch.press('Enter')
    if (isMobile(page)) {
      await mobileNavigation.mobileSidebar.waitFor()
      await expect(mobileNavigation.mobileSidebar).toBeAttached()
      await mobileNavigation.searchForm.nth(0).waitFor()
      await expect(mobileNavigation.searchForm.nth(0)).toBeVisible()
    } else {
      await search.searchForm.nth(1).waitFor()
      await search.searchForm.nth(1).press('Enter')
      await search.searchResetButton.nth(1).waitFor()
      await expect(search.searchResetButton.nth(1)).toBeVisible()
    }
  })
})

/**
 * Verifies that the error page is loaded if user visits non-existing route.
 * Verifies that the redirection to Homepage is done when Continue shopping button is clicked.
 */
test('C2216651 Verify 404 error page', async ({
  homePage,
  page,
  countryDetector,
  errorPage,
  baseURL,
}) => {
  await test.step('Visit non-existing page and verify the page is loaded', async () => {
    await page.goto('/non-existing-route', { waitUntil: 'commit' })
    await countryDetector.closeModal()
    await expect(errorPage.errorPageLogo).toBeVisible()
    await expect(errorPage.errorPageCode).toContainText('404')
  })
  await test.step('Click Continue shopping button and verify Homepage is loaded', async () => {
    await errorPage.errorPageButtonContinue.click()
    await homePage.homepageContent.waitFor()
    expect(page.url()).toEqual(baseURL + ROUTES.homepageDefault)
  })
})
