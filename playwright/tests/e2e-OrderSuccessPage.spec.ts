import { expect, test } from '../fixtures/fixtures'
import {
  getUserForBrowser,
  isMobile,
  verifySeoMetaTags,
} from '../support/utils'
import { CHECKOUT_URL, OSP_TEST_DATA } from '../support/constants'

test.beforeEach(
  async ({ accountPage, homePage, page, countryDetector }, testInfo) => {
    const projectName = testInfo.project.name
    const { email, password } = getUserForBrowser(projectName)
    await homePage.visitPage()
    await page.waitForLoadState('networkidle')
    await countryDetector.closeModal()
    await accountPage.userAuthentication(email, password)
  },
)

test('C2173505 C2173506 C2173507 C2173508 C2181795 C2182370 C2181791 Verify OSP', async ({
  checkoutPage,
  page,
  orderSuccessPage,
  homePage,
  mainNavigation,
  mobileNavigation,
  productListingPage,
  productDetailPage,
  countryDetector,
  breadcrumb,
}) => {
  await test.step('Add product to Basket', async () => {
    if (isMobile(page)) {
      await mobileNavigation.openPlpMobile()
    } else {
      await mainNavigation.navigateToPlpMainCategory()
    }
    await breadcrumb.breadcrumbCategoryActive.waitFor()
    await productListingPage.productCard.first().waitFor()
    await productListingPage.productCard.first().click()
    await page.waitForLoadState('domcontentloaded')
    await productDetailPage.variantPicker.click()
    await productDetailPage.getVariant().click()
    await productDetailPage.addProductToBasket()
  })
  await test.step('Visit Checkout page and continue with order', async () => {
    await page.goto(CHECKOUT_URL, { waitUntil: 'commit' })
    await checkoutPage.basketContainer.waitFor()
    const pageUrl = page.url()
    expect(pageUrl).toContain(CHECKOUT_URL)
    await checkoutPage.basketContainer.waitFor()
    await checkoutPage.checkboxAcceptTerms.click()
    await checkoutPage.ctaPayButton.click()
  })
  await test.step('Verify OSP Order overview', async () => {
    await orderSuccessPage.ospGreetingBox.waitFor()
    await countryDetector.closeModal()
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
  await test.step('Verify OSP SEO', async () => {
    await verifySeoMetaTags(page, {
      title: OSP_TEST_DATA.seoTitle,
      robots: OSP_TEST_DATA.seoRobots,
      description: OSP_TEST_DATA.seoDescription,
    })
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

test('C2182954 Verify OSP Error page', async ({
  page,
  orderSuccessPage,
  homePage,
}) => {
  await test.step('Visit OSP with incorect token and assert page elements', async () => {
    await page.goto(OSP_TEST_DATA.incorrectCbdUrl, { waitUntil: 'commit' })
    await orderSuccessPage.ospEmptyStateContainer.waitFor()
    await expect(orderSuccessPage.ospEmptyStateHeadline).toBeVisible()
    await expect(orderSuccessPage.ospEmptyStateSubheadline).toBeVisible()
    await expect(orderSuccessPage.ospEmptyStateIcon).toBeVisible()
  })
  await test.step('Click Continue Shopping button and assert Homepage is loaded', async () => {
    await orderSuccessPage.ospEmptyStateContinueShoppingButton.waitFor()
    await orderSuccessPage.ospEmptyStateContinueShoppingButton.click()
    await homePage.homepageContent.waitFor()
    await expect(homePage.homepageContent).toBeAttached()
  })
})
