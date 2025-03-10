import { expect, test } from '../fixtures/fixtures'
import { getUserForBrowser, isMobile } from '../support/utils'
import { CHECKOUT_URL, OSP_TEST_DATA } from '../support/constants'

test.beforeEach(async ({ accountPage, homePage, page }, testInfo) => {
  const projectName = testInfo.project.name
  const { email, password } = getUserForBrowser(projectName)
  await homePage.visitPage()
  await page.waitForLoadState('networkidle')
  await accountPage.userAuthentication(email, password)
})

test('C2173505 C2173506 C2173507 C2173508 C2181795 C2182370 Verify OSP', async ({
  checkoutPage,
  basketPage,
  page,
  orderSuccessPage,
  homePage,
}) => {
  await test.step('Add product to Basket', async () => {
    await basketPage.addProductToBasket(
      OSP_TEST_DATA.regularProductVariantId,
      1,
    )
  })
  await test.step('Visit Checkout page and continue with order', async () => {
    await page.goto(CHECKOUT_URL, { waitUntil: 'commit' })
    const pageUrl = page.url()
    expect(pageUrl).toContain(CHECKOUT_URL)
    await checkoutPage.basketContainer.waitFor()
    await checkoutPage.checkboxAcceptTerms.click()
    await checkoutPage.ctaPayButton.click()
  })
  await test.step('Verify OSP Order overview', async () => {
    await orderSuccessPage.ospGreetingBox.waitFor()
    await expect(orderSuccessPage.ospGreetingBox).toBeVisible()
    await expect(orderSuccessPage.ospGreetingBoxHeadline).toBeVisible()
    await expect(orderSuccessPage.ospOrderData).toBeVisible()
    await expect(orderSuccessPage.ospPaymentData).toBeVisible()
    await expect(orderSuccessPage.ospDeliveryAddress).toBeVisible()
  })
  await test.step('Verify OSP Order product details', async () => {
    await expect(orderSuccessPage.ospDeliveryDate).toBeVisible()
    await expect(orderSuccessPage.ospCarrier).toBeVisible()
    await expect(orderSuccessPage.ospProductCard.first()).toBeVisible()
    await expect(orderSuccessPage.ospProductImage.first()).toBeVisible()
    await expect(orderSuccessPage.ospProductBrand.first()).toBeVisible()
    await expect(orderSuccessPage.ospProductName.first()).toBeVisible()
    await expect(orderSuccessPage.ospProductColor.first()).toBeVisible()
    await expect(orderSuccessPage.ospProductSize.first()).toBeVisible()
    await expect(orderSuccessPage.ospProductQuantity.first()).toBeVisible()
    await expect(orderSuccessPage.ospProductPrice.first()).toBeVisible()
  })
  await test.step('Verify OSP Price summary', async () => {
    await orderSuccessPage.assertOspPriceSummary(
      orderSuccessPage.ospSubtotal,
      orderSuccessPage.ospShippingCost,
      orderSuccessPage.ospTotal,
    )
  })
  await test.step('Verify OSP CTA buttons', async () => {
    if (isMobile(page)) {
      await orderSuccessPage.ospContinueShoppingButton.nth(1).click()
    } else {
      await orderSuccessPage.ospContinueShoppingButton.nth(0).click()
    }
    await homePage.homepageContent.waitFor()
    await expect(homePage.homepageContent).toBeAttached()
    await page.goBack()
    await page.waitForLoadState('networkidle')
    if (isMobile(page)) {
      await orderSuccessPage.ospOrderDetailsButton.nth(1).waitFor()
      await orderSuccessPage.ospOrderDetailsButton.nth(1).click()
    } else {
      await orderSuccessPage.ospOrderDetailsButton.nth(0).waitFor()
      await orderSuccessPage.ospOrderDetailsButton.nth(0).click()
    }
    await page.waitForTimeout(500)
    expect(page.url()).toContain(OSP_TEST_DATA.ordersUrl)
  })
})
