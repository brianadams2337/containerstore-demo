import { expect, test } from '../fixtures/fixtures'
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
  breadcrumb,
}) => {
  test.setTimeout(60000)
  if (isMobile(page)) {
    await test.step('Mobile - navigate to 2nd category level', async () => {
      await mobileNavigation.openPlpMobile()
      const mainCategoryLabel =
        (await breadcrumb.breadcrumbCategoryLvl0.textContent()) as string
      const activeCategoryLabel =
        (await breadcrumb.breadcrumbCategoryActive.textContent()) as string
      await expect(page.title()).resolves.toContain(
        `${mainCategoryLabel} - ${activeCategoryLabel
          .replace(/\d/g, '')
          .trim()} | `,
      )
    })
  } else {
    await test.step('Desktop - check navigation overlay', async () => {
      await mainNavigation.openMainNavigationOverlay()
      await expect(mainNavigation.desktopNavigationFlyout).toBeVisible()
    })
    await test.step('Desktop - navigate to main category PLP', async () => {
      await mainNavigation.navigateToPlpMainCategory()
      await page.mouse.move(0, 0)
      const activeCategoryLabel =
        (await breadcrumb.breadcrumbCategoryActive.textContent()) as string
      await expect(page.title()).resolves.toContain(
        `${activeCategoryLabel.replace(/\d/g, '').trim()} | `,
      )
    })
    await test.step('Desktop - navigate to sub-category PLP', async () => {
      await mainNavigation.navigateToPlpSubCategory()
      const mainCategoryLabel =
        (await breadcrumb.breadcrumbCategoryLvl0.textContent()) as string
      const activeCategoryLabel =
        (await breadcrumb.breadcrumbCategoryActive.textContent()) as string
      await expect(page.title()).resolves.toContain(
        `${mainCategoryLabel} - ${activeCategoryLabel
          .replace(/\d/g, '')
          .trim()} | `,
      )
    })
  }
})
