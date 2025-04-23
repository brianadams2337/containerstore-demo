import { expect, test } from '../fixtures/fixtures'
import { getUserForBrowser, isMobile } from '../support/utils'
import { CHECKOUT_URL } from '../support/constants'

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

test('C2132536 C2144177 Verify Checkout order overview', async ({
  checkoutPage,
  page,
  footer,
  mainNavigation,
  mobileNavigation,
  productListingPage,
  productDetailPage,
  breadcrumb,
}) => {
  await test.step('Adding product to Basket', async () => {
    if (isMobile(page)) {
      await mobileNavigation.openPlpMobile()
    } else {
      await mainNavigation.navigateToPlpMainCategory()
    }
    await breadcrumb.breadcrumbCategoryActive.waitFor()
    await productListingPage.productImage.first().click()
    await productDetailPage.variantPicker.waitFor()
    await productDetailPage.variantPicker.click({ force: true })
    await productDetailPage.getVariant().click()
    await productDetailPage.addProductToBasket()
    await page.goto(CHECKOUT_URL, { waitUntil: 'commit' })
  })
  await test.step('Visit Checkout page and check Items', async () => {
    const pageUrl = page.url()
    expect(pageUrl).toContain(CHECKOUT_URL)
    await expect(async () => {
      await checkoutPage.basketContainer.waitFor()
      await expect(checkoutPage.basketContainer).toBeAttached()
      await expect(checkoutPage.itemQuantity).toBeVisible()
      await expect(checkoutPage.deliveryEstimate).toBeVisible()
    }).toPass()
  })
  await test.step('Verify simplified Footer in Checkout', async () => {
    await expect(footer.footerCopyright).toBeVisible()
    const count = await footer.simpleFooterLink.count()
    for (let i = 0; i < count; i++) {
      const link = footer.simpleFooterLink.nth(i)
      const href = await link.getAttribute('href')
      if (href) {
        try {
          const response = await page.request.head(href)
          expect(response.status()).toBeLessThan(400)
        } catch (error) {
          console.error(`Error checking link ${href}:`, error)
        }
      } else {
        console.warn(`Link element ${i} does not have an href attribute.`)
      }
      await expect(footer.simpleFooterLink.nth(i)).toHaveAttribute(
        'target',
        '_blank',
        { timeout: 5000 },
      )
    }
  })
  await test.step('Remove item and check empty state', async () => {
    await expect(async () => {
      await checkoutPage.buttonItemRemove.click()
      await expect(checkoutPage.basketContainer).not.toBeAttached()
    }).toPass()
  })
})
