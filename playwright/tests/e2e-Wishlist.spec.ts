import { expect, test } from '../fixtures/fixtures'
import {
  HOMEPAGE_PATH_DE,
  LOGGED_IN_USER_DATA,
  WISHLIST_PRODUCT_ID,
  WISHLIST_PRODUCT_ID_ONESIZE,
} from '../support/constants'
import { isMobile } from '../support/utils'

test.beforeEach(async ({ wishlistPage, baseURL, countryDetector }) => {
  await wishlistPage.visitWishlistPage('/wishlist', baseURL as string)
  await countryDetector.closeModal()
})

test('C2132174 C2132177 Verify Wishlist empty state', async ({
  wishlistPage,
  header,
  signinPage,
  page,
}) => {
  await test.step('Verify guest user', async () => {
    await expect(async () => {
      await wishlistPage.emptyState.waitFor()
      await expect(wishlistPage.buttonContinueShopping).toBeVisible()
      await expect(wishlistPage.buttonSignIn).toBeVisible()
      await expect(wishlistPage.emptyStateIcon).toBeVisible()
      await expect(wishlistPage.emptyStateHeadline).toBeVisible()
      await expect(wishlistPage.emptyStateSubheadline).toBeVisible()
    }).toPass()
  })
  await test.step('Verify logged-in user', async () => {
    await expect(async () => {
      await header.headerLoginButton.click()
      await signinPage.fillLoginData(
        LOGGED_IN_USER_DATA.email,
        LOGGED_IN_USER_DATA.password,
      )
      await signinPage.clickLoginButton()
      await page.waitForURL(HOMEPAGE_PATH_DE)
      await header.wishlistLink.click()
      await wishlistPage.emptyState.waitFor()
      await expect(wishlistPage.buttonContinueShopping).toBeVisible()
      await expect(wishlistPage.emptyStateIcon).toBeVisible()
      await expect(wishlistPage.emptyStateHeadline).toBeVisible()
      await expect(wishlistPage.emptyStateSubheadline).toBeVisible()
    }).toPass()
  })
})

test('C2141222 Verify wishlist items', async ({
  wishlistPage,
  header,
  page,
  countryDetector,
}) => {
  await test.step('Add item to wishlist and verify product card', async () => {
    await expect(async () => {
      await wishlistPage.addProductToWishlist(WISHLIST_PRODUCT_ID)
      await page.reload()
      await countryDetector.closeModal()
      await header.wishlistLink.waitFor()
      await expect(header.wishlistNumItems).toHaveText('1')
      await wishlistPage.wishlistItemsWrapper.waitFor()
      await expect(wishlistPage.wishlistCard).toBeVisible()
      await expect(wishlistPage.productBrand).toBeVisible()
    }).toPass()
  })
  await test.step('Remove item from wishlist', async () => {
    await expect(async () => {
      await wishlistPage.removeItemFromWishlist()
      await wishlistPage.emptyState.waitFor()
      await expect(wishlistPage.buttonContinueShopping).toBeVisible()
    }).toPass()
  })
})

test.skip('C2141223 Verify wishlist multi-size product add to basket', async ({
  wishlistPage,
  header,
  page,
}) => {
  await expect(async () => {
    await wishlistPage.addProductToWishlist(WISHLIST_PRODUCT_ID)
    await page.reload()
    if (isMobile(page)) {
      await wishlistPage.addProductToBasket()
      await wishlistPage.chooseProductSize()
    } else {
      await wishlistPage.chooseProductSize()
      await wishlistPage.addProductToBasket()
    }
    await header.basketNumItems.waitFor()
    await expect(header.basketNumItems).toHaveText('1')
  }).toPass()
})

test.skip('C2141224 Verify wishlist one-size product add to basket', async ({
  wishlistPage,
  header,
  page,
}) => {
  await expect(async () => {
    await wishlistPage.addProductToWishlist(WISHLIST_PRODUCT_ID_ONESIZE)
    await page.reload()
    await wishlistPage.addProductToBasket()
    await expect(header.basketNumItems).toHaveText('1')
  }).toPass()
})
