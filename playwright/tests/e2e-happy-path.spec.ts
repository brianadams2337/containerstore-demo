import { expect, test } from '../fixtures/fixtures'
import { isMobile } from '../support/utils'
import {
  BASKET_TEST_DATA,
  E2E_BASKET_URL,
  SEARCH_SUGGESTIONS,
} from '../support/constants'

test('C2139186: E2E from Home to Checkout - happy path', async ({
  homePage,
  productListingPage,
  productDetailPage,
  header,
  basketPage,
  page,
  signinPage,
  mobileNavigation,
  search,
  breadcrumb,
  countryDetector,
}) => {
  await test.step('Search for a category and navigate to PLP', async () => {
    await homePage.visitPage()
    await page.waitForLoadState('networkidle')
    await countryDetector.closeModal()
    await expect(async () => {
      if (isMobile(page)) {
        await mobileNavigation.startTypingMobileSearch(
          SEARCH_SUGGESTIONS.searchTermProduct,
          false,
        )
        await mobileNavigation.exactProductItem.click()
        await breadcrumb.productCounter.waitFor()
      } else {
        await search.startTypingSearch(SEARCH_SUGGESTIONS.searchTermProduct)
        await search.searchCategoryListItem.first().click()
        await productListingPage.menuRootCategory.waitFor()
      }
    }).toPass()
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
