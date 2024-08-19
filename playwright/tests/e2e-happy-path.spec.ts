import { expect, test } from '../fixtures/fixtures'
import { E2E_BASKET_URL, PLP_BASE_PATH } from '../support/constants'

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
  await homePage.visitPage()
  await mainNavigation.mainMenuCategoryClick(page)
  await productListingPage.menuSubCategoryLvl1.first().click()
  await page.waitForURL(PLP_BASE_PATH)
  await productListingPage.addProductToWishlist()
  await expect(header.wishlistNumItems).toBeVisible()
  await expect(header.wishlistNumItems).toHaveText('1')

  await productListingPage.openProductDetails()

  await productDetailPage.pickProductSize()
  await productDetailPage.addProductToBasket()

  await header.visitBasketPage()
  await expect(page).toHaveURL(E2E_BASKET_URL)
  await basketPage.assertProductIsInBasket()

  await basketPage.gotoCheckoutPage()
  await signinPage.loginButton.waitFor({ state: 'visible' })

  expect(page.url()).toContain('signin?redirectUrl=checkout')
})
