import { expect, test } from '../fixtures/fixtures'
import { isMobile } from '../support/utils'
import { E2E_BASKET_URL, CHECKOUT_REDIRECT_URL } from '../support/constants'

test('C2139186: E2E from Home to Checkout - happy path', async ({
  homePage,
  productListingPage,
  productDetailPage,
  header,
  basketPage,
  page,
  signinPage,
  mobileNavigation,
  countryDetector,
  mainNavigation,
}) => {
  await test.step('Navigate to PLP', async () => {
    await homePage.visitPage()
    await page.waitForLoadState('networkidle')
    await countryDetector.closeModal()
    if (isMobile(page)) {
      await mobileNavigation.openPlpMobile()
    } else {
      await mainNavigation.navigateToPlpMainCategory()
    }
  })
  await test.step('Add product to Wishlist from PLP', async () => {
    await expect(async () => {
      await productListingPage.addProductToWishlist()
      await page.waitForLoadState('networkidle')
      await expect(header.wishlistNumItems).toBeVisible()
      await expect(header.wishlistNumItems).toHaveText('1')
    }).toPass()
  })
  await test.step('Open PDP and add product to Basket', async () => {
    await expect(async () => {
      await productListingPage.productImage.first().click()
      await productDetailPage.variantPicker.waitFor()
      await productDetailPage.variantPicker.click({ force: true })
      await productDetailPage.getVariant().click()
      await productDetailPage.addProductToBasket()
    }).toPass()
    const basketProductBrandText =
      await productDetailPage.productBrand.textContent()
    const basketProductNameText =
      await productDetailPage.productName.textContent()
    await expect(async () => {
      await header.visitBasketPage()
      await expect(page).toHaveURL(E2E_BASKET_URL)
      await basketPage.assertProductIsInBasket(
        basketProductBrandText as string,
        basketProductNameText as string,
      )
    }).toPass()
  })
  await test.step('Go to Checkout page', async () => {
    await expect(async () => {
      if (isMobile(page)) {
        await basketPage.gotoCheckoutPage(1)
      } else {
        await basketPage.gotoCheckoutPage(0)
      }
      await signinPage.loginButton.waitFor({ state: 'visible' })
      expect(page.url()).toContain(CHECKOUT_REDIRECT_URL)
    }).toPass()
  })
  await test.step('Empty Basket to have clean state after test execution', async () => {
    await expect(async () => {
      await header.visitBasketPage()
      await expect(page).toHaveURL(E2E_BASKET_URL)
      await basketPage.removeItemFromBasket()
    }).toPass()
  })
})
