import { expect, test } from '../fixtures/fixtures'
import {
  BASKET_TEST_DATA,
  E2E_BASKET_URL,
  PLP_PATH_MAIN_CATEGORY,
  PLP_SUBCATEGORY_NAME_DE,
} from '../support/constants'

test('C2139186: E2E from Home to Checkout - happy path', async ({
  homePage,
  mainNavigation,
  productListingPage,
  productDetailPage,
  header,
  basketPage,
  page,
  signinPage,
}) => {
  await test.step('Visit Homepage and navigate to PLP', async () => {
    await expect(async () => {
      await homePage.visitPage()
      await mainNavigation.mainMenuCategoryClick()
      const pageUrl = page.url()
      expect(pageUrl).toContain(PLP_PATH_MAIN_CATEGORY)
      await productListingPage.openTestCategoryPLP(PLP_SUBCATEGORY_NAME_DE)
    }).toPass()
  })

  await test.step('Add product to Wishlist from PLP', async () => {
    await expect(async () => {
      await productListingPage.addProductToWishlist()
      await expect(header.wishlistNumItems).toBeVisible()
      await expect(header.wishlistNumItems).toHaveText('1')
    }).toPass()
  })

  await test.step('Open PDP and add product to Basket', async () => {
    await expect(async () => {
      await productListingPage.openProductDetails()
      await productDetailPage.pickProductSize()
      await productDetailPage.addProductToBasket()
    }).toPass()
  })

  await test.step('Assert product is in Basket', async () => {
    await expect(async () => {
      await header.visitBasketPage()
      await expect(page).toHaveURL(E2E_BASKET_URL)
      await basketPage.assertProductIsInBasket(
        BASKET_TEST_DATA.productRegularBrand,
        BASKET_TEST_DATA.productNameHappyPath,
      )
    }).toPass()
  })

  await test.step('Go to Checkout page', async () => {
    await expect(async () => {
      await basketPage.gotoCheckoutPage()
      await signinPage.loginButton.waitFor({ state: 'visible' })
      expect(page.url()).toContain('signin?redirectUrl=checkout')
    }).toPass()
  })

  await test.step('Empty Basket to have clean state after test execution', async () => {
    await expect(async () => {
      await basketPage.emptyBasket(BASKET_TEST_DATA.itemKeyBasketE2E)
    }).toPass()
  })
})
