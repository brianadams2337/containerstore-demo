import { expect, test } from '../fixtures/fixtures'

test.beforeEach(async ({ homePage, countryDetector }) => {
  await homePage.visitPage()
  await countryDetector.closeModal()
})

test('C2185235 Verify Promotion Ribbon', async ({
  promotions,
  page,
  basketPage,
  header,
}) => {
  await test.step('Check the Ribbon is visible and contains promotion data', async () => {
    await promotions.promotionRibbon.waitFor()
    await expect(promotions.promotionRibbon).toBeVisible()
    await expect(promotions.promotionRibbonTimer).toBeVisible()
    await expect(promotions.promotionRibbonHeadline).toBeVisible()
    await expect(promotions.promotionRibbonSubheadline).toBeVisible()
  })
  await test.step('Check Ribbon scrolled state', async () => {
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
    await expect(promotions.promotionRibbon).toBeVisible()
  })
  await test.step('Check Ribbon not visible on Basket page', async () => {
    await header.visitBasketPage()
    await basketPage.emptyState.waitFor()
    await expect(promotions.promotionRibbon).not.toBeVisible()
  })
})

test('C2185240 C2185241 Verify Promotion Flyout', async ({
  promotions,
  header,
}) => {
  await test.step('Check the Promotion flyout button', async () => {
    await header.promotionsButton.waitFor()
    await header.promotionsButton.click()
  })
  await test.step('Check the Promotion flyout open state', async () => {
    await promotions.closeFlyoutButton.waitFor()
    await expect(promotions.promotionsCounter).toBeVisible()
    await expect(promotions.promotionCard.first()).toBeVisible()
  })
})
