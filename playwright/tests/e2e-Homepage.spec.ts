import { expect, test } from '../fixtures/fixtures'
import { getAllLinksFromPage, isMobile } from '../support/utils'

test.beforeEach(async ({ homePage, countryDetector, page }) => {
  await homePage.visitPage()
  await page.waitForLoadState('domcontentloaded')
  await countryDetector.closeModal()
})

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

test('C2141228 Verify Homepage links', async ({ page, context }) => {
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

test('C2167297 Verify Homepage Skip Links', async ({
  homePage,
  skipLinks,
  page,
  search,
  mobileNavigation,
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
