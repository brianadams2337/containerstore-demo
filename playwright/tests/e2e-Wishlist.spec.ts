import { expect, test } from '../fixtures/fixtures'
import {
  HOMEPAGE_PATH_DE,
  LOGGED_IN_USER_DATA,
  WISHLIST_PRODUCT_ID,
  WISHLIST_PRODUCT_ID_ONESIZE,
  ROUTES,
  WISHLIST_TEST_DATA,
} from '../support/constants'
import { verifySeoMetaTags } from '../support/utils'

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
      await page.waitForURL(HOMEPAGE_PATH_DE + ROUTES.wishlist)
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

test('C2183076 Verify Wishlist SEO data', async ({
  wishlistPage,
  page,
  baseURL,
}) => {
  await wishlistPage.addProductToWishlist(WISHLIST_PRODUCT_ID_ONESIZE)
  await page.reload()
  await wishlistPage.h1.waitFor()
  const pageTitle = (await wishlistPage.pageTitle
    .nth(0)
    .textContent()) as string

  await verifySeoMetaTags(page, {
    title: WISHLIST_TEST_DATA.seoTitle,
    robots: WISHLIST_TEST_DATA.seoRobots,
    description: WISHLIST_TEST_DATA.seoDescription,
    canonical: baseURL + HOMEPAGE_PATH_DE + ROUTES.wishlist,
  })
  await expect(wishlistPage.h1).toBeAttached()
  await expect(wishlistPage.h1).toContainText(pageTitle)
})
