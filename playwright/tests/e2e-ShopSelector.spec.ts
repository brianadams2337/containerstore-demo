import { expect, test } from '../fixtures/fixtures'
import { isMobile } from '../support/utils'

test.beforeEach(async ({ homePage, countryDetector, page }) => {
  await homePage.visitPage()
  await page.waitForLoadState('domcontentloaded')
  await countryDetector.closeModal()
})

test('C2162469: Verify Shop Selector switch to different shop', async ({
  shopSelector,
  page,
  mobileNavigation,
}) => {
  await test.step('Assert Shop Selector is visible and in closed state', async () => {
    await expect(async () => {
      if (isMobile(page)) {
        await mobileNavigation.sideNavigationButton.click()
        await shopSelector.assertShopSelectorIsVisible(1)
      } else {
        await shopSelector.assertShopSelectorIsVisible(0)
      }
    }).toPass()
  })
  await test.step('Click Shop Selector toggle button and assert open state', async () => {
    await expect(async () => {
      if (isMobile(page)) {
        await shopSelector.openShopSelector(1)
      } else {
        await shopSelector.openShopSelector(0)
      }
    }).toPass()
  })
  await test.step('Select different shop and assert the shop is switched', async () => {
    await expect(async () => {
      if (isMobile(page)) {
        await shopSelector.switchShop(1)
      } else {
        await shopSelector.switchShop(0)
      }
    }).toPass()
  })
})

test('C2162470: Verify Shop Selector switch to the current shop', async ({
  shopSelector,
  page,
  mobileNavigation,
}) => {
  await expect(async () => {
    if (isMobile(page)) {
      await mobileNavigation.sideNavigationButton.click()
      await page.waitForTimeout(500)
      await shopSelector.openShopSelector(1)
      await shopSelector.switchShopToCurrent(1)
    } else {
      await shopSelector.openShopSelector(0)
      await shopSelector.switchShopToCurrent(0)
    }
  }).toPass()
})

test('C2162471: Verify Shop Selector switch from non-Homepage', async ({
  shopSelector,
  page,
  mobileNavigation,
  header,
  wishlistPage,
}, testInfo) => {
  // Test skipped only for Mobile Safari due to the timeouts occuring in the Gitlab CI execution.
  // Feel free to remove the line below and try to execute the test locally or in CI to check if the timeouts are encountered.
  test.skip(
    testInfo.project.name === 'mobile-safari',
    'Potential Gitlab CI execution issues in Mobile Safari',
  )
  await test.step('Navigate to Wishlist page', async () => {
    await header.wishlistLink.click()
    await page.waitForLoadState('domcontentloaded')
    await wishlistPage.emptyState.waitFor()
  })
  await test.step('Switch the shop and assert Wishlist page is loaded in different shop', async () => {
    if (isMobile(page)) {
      await mobileNavigation.sideNavigationButton.click()
      await page.waitForTimeout(500)
      await shopSelector.assertShopSelectorIsVisible(1)
      await shopSelector.openShopSelector(1)
      await shopSelector.switchShop(1)
    } else {
      await shopSelector.assertShopSelectorIsVisible(0)
      await shopSelector.openShopSelector(0)
      await shopSelector.switchShop(0)
    }
    const pageUrl = page.url()
    expect(pageUrl).not.toContain('/wishlist')
  })
})
