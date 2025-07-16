import { test } from '../../fixtures/fixtures'
import { expect } from '@playwright/test'
import { PDP_E2E } from '../../support/constants'
import { isMobile, verifySeoMetaTags } from '../../support/utils'

/**
 * @file Contains end-to-end tests for the Product Detail Page (PDP),
 * verifying elements like name, brand, price, wishlist functionality,
 * page title, and SEO meta tags.
 */

/**
 * Verifies that the product brand, name, regular price, and
 * tax information are visible on the Product Detail Page.
 */
test('C2141594: Verify PDP name, brand and price', async ({
  productDetailPage,
  countryDetector,
  homePage,
  page,
  mobileNavigation,
  mainNavigation,
  breadcrumb,
  productListingPage,
}) => {
  await homePage.visitPage()
  await page.waitForLoadState('networkidle')
  await countryDetector.closeModal()

  if (isMobile(page)) {
    await mobileNavigation.openPlpMobile()
  } else {
    await mainNavigation.navigateToPlpMainCategory()
  }

  await breadcrumb.breadcrumbCategoryActive.waitFor()
  await expect(async () => {
    await productListingPage.productImage.first().click()
    await page.waitForLoadState('domcontentloaded')
    await productDetailPage.h1.waitFor()
    await countryDetector.closeModal()
    await expect(productDetailPage.productBrand).toBeVisible()
    await expect(productDetailPage.productName).toBeVisible()
    await expect(productDetailPage.priceRegular.first()).toBeVisible()
    await expect(productDetailPage.taxInfo).toBeVisible()
  }).toPass()
})

/**
 * C2141598: Verifies that a user can add a product to their Wishlist from the
 * Product Detail Page and that the Wishlist item counter in the header is updated.
 * It also verifies the removal of the product from the Wishlist, checking if the
 * counter is updated accordingly.
 */
test('C2141598: Verify PDP add and remove to/from Wishlist', async ({
  productDetailPage,
  header,
  page,
  countryDetector,
  homePage,
  mobileNavigation,
  mainNavigation,
  breadcrumb,
  productListingPage,
}) => {
  await homePage.visitPage()
  await page.waitForLoadState('networkidle')
  await countryDetector.closeModal()

  if (isMobile(page)) {
    await mobileNavigation.openPlpMobile()
  } else {
    await mainNavigation.navigateToPlpMainCategory()
  }

  await breadcrumb.breadcrumbCategoryActive.waitFor()
  await productListingPage.productImage.first().click()
  await page.waitForLoadState('domcontentloaded')
  await productDetailPage.h1.waitFor()

  await test.step('Adding product to Wishlist', async () => {
    await productDetailPage.assertAddToWishlistIconVisibility()
    await page.waitForLoadState('networkidle')
    await productDetailPage.addProductToWishlist()
    await productDetailPage.assertRemoveFromWishlistIconVisibility()
    await expect(header.wishlistNumItems).toHaveText('1')
  })

  await test.step('Removing product from Wishlist', async () => {
    await productDetailPage.removeProductFromWishlist()
    await expect(header.wishlistNumItems).not.toBeVisible()
  })
})

/**
 * Verifies the presence and correctness of specific SEO meta tags
 * (robots and canonical) on the Product Detail Page, checks if the
 * main headline (H1) contains the page title and that the product name
 * is contained in the SEO page title.
 */
test('C2141150 C2141757 Verify PDP SEO data', async ({
  productDetailPage,
  countryDetector,
  page,
  mobileNavigation,
  mainNavigation,
  homePage,
  breadcrumb,
  productListingPage,
}) => {
  await homePage.visitPage()
  await page.waitForLoadState('networkidle')
  await countryDetector.closeModal()

  if (isMobile(page)) {
    await mobileNavigation.openPlpMobile()
  } else {
    await mainNavigation.navigateToPlpMainCategory()
  }

  await breadcrumb.breadcrumbCategoryActive.waitFor()
  await productListingPage.productImage.first().click()
  await productDetailPage.h1.waitFor()

  const pageTitle = (await productDetailPage.pageTitle.textContent()) as string
  const pageTitleSEO = await page.title()
  const productName = await productDetailPage.productName.textContent()

  await verifySeoMetaTags(page, {
    robots: PDP_E2E.seoRobots,
    canonical: page.url(),
  })
  await expect(productDetailPage.h1).toBeAttached()
  await expect(productDetailPage.h1).toContainText(pageTitle)
  expect(pageTitleSEO).toContain(productName)
})
