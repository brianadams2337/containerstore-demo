import { expect, test } from '../fixtures/fixtures'
import { E2E_BASKET_URL } from '../support/constants'

test('C2139186: E2E from Home to Checkout - happy path', async ({
  homePage,
  mainNavigation,
  productListingPage,
  productDetailPage,
  header,
  basketPage,
  page,
}) => {
  await homePage.visitPage()
  await mainNavigation.menuItemSecond.click()
  await productListingPage.menuSubCategoryLvl1.first().click()
  await productListingPage.addProductToWishlist()
  await expect(header.wishlistNumItems).toHaveText('1')

  await productListingPage.openProductDetails()

  await productDetailPage.pickProductSize()
  await productDetailPage.addProductToBasket()

  await header.visitBasketPage()
  await expect(page).toHaveURL(E2E_BASKET_URL)
  await basketPage.assertProductIsInBasket()

  await basketPage.gotoCheckoutPage()
  expect(page.url()).toContain('signin?redirectUrl=checkout')
})
