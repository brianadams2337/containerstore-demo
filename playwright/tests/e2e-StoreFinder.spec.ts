import { expect, test } from '../fixtures/fixtures'
import { isMobile } from '../support/utils'
import { LOCATION } from '../support/constants'

test.beforeEach(async ({ homePage, countryDetector, page }) => {
  await homePage.visitPage()
  await page.waitForLoadState('domcontentloaded')
  await countryDetector.closeModal()
})

test('C2161318: Verify find store by city', async ({
  page,
  mobileNavigation,
  storeLocator,
}) => {
  if (isMobile(page)) {
    await mobileNavigation.sideNavigationButton.click()
  }
  await storeLocator.navigateToLocationPage(LOCATION.city)
  await storeLocator.triggerSearch()
  await storeLocator.assertStoreListIsLoaded()
})

test('C2161319: Verify find store by ZIP code', async ({
  page,
  mobileNavigation,
  storeLocator,
}) => {
  if (isMobile(page)) {
    await mobileNavigation.sideNavigationButton.click()
  }
  await storeLocator.navigateToLocationPage(LOCATION.zipCode)
  await storeLocator.triggerSearch()
  await storeLocator.assertStoreListIsLoaded()
})

test('C2161368: Verify find store by invalid ZIP code', async ({
  page,
  mobileNavigation,
  storeLocator,
}) => {
  if (isMobile(page)) {
    await mobileNavigation.sideNavigationButton.click()
  }
  await storeLocator.navigateToLocationPage(LOCATION.zipCodeInvalid)
  await storeLocator.triggerSearch()
  await expect(storeLocator.locationStoreList).not.toBeVisible()
})
