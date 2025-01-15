import { expect, test } from '../fixtures/fixtures'
import { NAVIGATION_TEST_ITEMS } from '../support/constants'
import { isMobile } from '../support/utils'

test.beforeEach(async ({ homePage, countryDetector, page }) => {
  await homePage.visitPage()
  await page.waitForLoadState('domcontentloaded')
  await countryDetector.closeModal()
})

test('C2130722 C2143633 C2143634 Verify Main Navigation Flyout and navigating to Main category PLP', async ({
  mainNavigation,
  mobileNavigation,
  page,
}) => {
  if (isMobile(page)) {
    await test.step('Mobile - navigate to 3rd category level', async () => {
      await expect(async () => {
        await mobileNavigation.navigateToPlpMobile(
          NAVIGATION_TEST_ITEMS.mainCategory,
          NAVIGATION_TEST_ITEMS.categoryLevel2,
          NAVIGATION_TEST_ITEMS.categoryLevel3,
        )
        await expect(page).toHaveTitle(
          `${NAVIGATION_TEST_ITEMS.mainCategory} - ${NAVIGATION_TEST_ITEMS.categoryLevel2} - ${NAVIGATION_TEST_ITEMS.categoryLevel3} - ${NAVIGATION_TEST_ITEMS.shopName}`,
        )
      }).toPass()
    })
  } else {
    await test.step('Desktop - check navigation overlay', async () => {
      await expect(async () => {
        await mainNavigation.openMainNavigationOverlay(
          NAVIGATION_TEST_ITEMS.mainCategory,
        )
        await expect(mainNavigation.desktopNavigationFlyout).toBeVisible()
      }).toPass()
    })
    await test.step('Desktop - navigate to main category PLP', async () => {
      await expect(async () => {
        await mainNavigation.navigateToPlpMainCategory(
          NAVIGATION_TEST_ITEMS.mainCategory,
        )
        await expect(page).toHaveTitle(
          `${NAVIGATION_TEST_ITEMS.mainCategory} - ${NAVIGATION_TEST_ITEMS.shopName}`,
        )
      }).toPass()
    })
    await test.step('Desktop - navigate to sub-category PLP', async () => {
      await expect(async () => {
        await mainNavigation.navigateToPlpSubCategory(
          NAVIGATION_TEST_ITEMS.mainCategory,
          NAVIGATION_TEST_ITEMS.categoryLevel3,
        )
        await expect(page).toHaveTitle(
          `${NAVIGATION_TEST_ITEMS.mainCategory} - ${NAVIGATION_TEST_ITEMS.categoryLevel2} - ${NAVIGATION_TEST_ITEMS.categoryLevel3} - ${NAVIGATION_TEST_ITEMS.shopName}`,
        )
      }).toPass()
    })
  }
})
