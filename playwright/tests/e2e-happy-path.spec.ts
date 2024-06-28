import { expect, test } from '../fixtures/fixtures'
import { E2E_BASKET_URL, LOGGED_IN_USER_DATA } from '../support/constants'

test('E2E from Home to Checkout - happy path', async ({
  homePage,
  mainNavigation,
  productListingPage,
  productDetailPage,
  header,
  basketPage,
  signinPage,
  checkoutPage,
  page,
}) => {
  await homePage.visitPage()
  await mainNavigation.menuItemSecond.click()
  await mainNavigation.menuSubcategory.click()
  await productListingPage.addProductToWishlist()
  await expect(header.wishlistNumItems).toHaveText('1')

  await productListingPage.openProductDetails()

  await productDetailPage.pickProductSize()
  await productDetailPage.addProductToBasket()

  await header.visitBasketPage()
  await expect(page).toHaveURL(E2E_BASKET_URL)
  await basketPage.assertProductIsInBasket()

  await basketPage.gotoCheckoutPage()
  await signinPage.fillLoginData(
    LOGGED_IN_USER_DATA.email,
    LOGGED_IN_USER_DATA.password,
  )
  await signinPage.clickLoginButton()

  await checkoutPage.assertCheckoutPageURL()
})
