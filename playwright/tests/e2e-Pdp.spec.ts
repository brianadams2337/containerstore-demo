import { expect, test } from '../fixtures/fixtures'
import {
  PDP_E2E,
  LOCATION,
  PDP_TEST_VARIANT_ID,
  HOMEPAGE_PATH_DE,
} from '../support/constants'
import { isMobile, verifySeoMetaTags } from '../support/utils'

test('C2141594: Verify PDP name, brand and price for regular product', async ({
  productDetailPage,
  baseURL,
  countryDetector,
}) => {
  await productDetailPage.visitPDP(PDP_E2E.regularProductUrl, baseURL as string)
  await expect(async () => {
    await countryDetector.closeModal()
    await expect(productDetailPage.productBrand).toBeVisible()
    await expect(productDetailPage.productName).toBeVisible()
    await expect(productDetailPage.priceRegular.first()).toBeVisible()
    await expect(productDetailPage.taxInfo).toBeVisible()
  }).toPass()
})

test('C2141595: Verify PDP add to Basket for regular product multi size', async ({
  productDetailPage,
  baseURL,
  header,
  toastMessage,
  countryDetector,
}) => {
  await productDetailPage.visitPDP(PDP_E2E.regularProductUrl, baseURL as string)
  const productName = await productDetailPage.productName.textContent()

  await expect(async () => {
    await countryDetector.closeModal()
    await productDetailPage.variantPicker.waitFor()
    // { force: true } added due to the specific behavior in Chrome Mobile, when Playwright retries to click and fails at the end.
    // This step works fine without { force: true } in all other browsers.
    await productDetailPage.variantPicker.click({ force: true })
    await productDetailPage.getVariant().click()
    await productDetailPage.addProductToBasket()
    await expect(header.basketNumItems).toHaveText('1')
    await expect(toastMessage.toastInfo).toContainText(productName as string)
  }).toPass()
})

test('C2141596: Verify PDP add to Basket for regular product one-size', async ({
  productDetailPage,
  baseURL,
  header,
  toastMessage,
  countryDetector,
}) => {
  await productDetailPage.visitPDP(PDP_E2E.oneSizeProductUrl, baseURL as string)
  const productName = await productDetailPage.productName.textContent()
  await countryDetector.closeModal()
  await productDetailPage.addProductToBasket()
  await header.basketNumItems.waitFor()
  await expect(header.basketNumItems).toHaveText('1')
  await expect(toastMessage.toastInfo).toBeVisible()
  await expect(toastMessage.toastInfo).toContainText(productName as string)
})

test('C2141597: Verify PDP quantity selector', async ({
  productDetailPage,
  baseURL,
  header,
  page,
  countryDetector,
}) => {
  await productDetailPage.visitPDP(PDP_E2E.oneSizeProductUrl, baseURL as string)
  await page.waitForLoadState('domcontentloaded')
  await countryDetector.closeModal()
  await expect(productDetailPage.quantityValue).toHaveValue('1')
  await expect(productDetailPage.quantityMinus).toBeDisabled()
  await expect(productDetailPage.quantityPlus).toBeEnabled()
  await productDetailPage.quantityPlus.click()
  await productDetailPage.quantityPlus.click()
  await expect(productDetailPage.quantityMinus).toBeEnabled()
  await expect(productDetailPage.quantityValue).toHaveValue('3')
  await productDetailPage.quantityMinus.click()
  await expect(productDetailPage.quantityValue).toHaveValue('2')

  await productDetailPage.addProductToBasket()
  await expect(header.basketNumItems).toHaveText('2')
})

test('C2141598: Verify PDP add and remove to/from Wishlist', async ({
  productDetailPage,
  baseURL,
  header,
  page,
  countryDetector,
}) => {
  await productDetailPage.visitPDP(PDP_E2E.regularProductUrl, baseURL as string)
  await page.waitForLoadState('domcontentloaded')
  await countryDetector.closeModal()
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

test('C2141599: Verify PDP Subscription service', async ({
  productDetailPage,
  baseURL,
  page,
  header,
  countryDetector,
}) => {
  await productDetailPage.visitPDP(
    PDP_E2E.subscribeProductUrl,
    baseURL as string,
  )
  await page.waitForLoadState('domcontentloaded')
  await countryDetector.closeModal()
  await test.step('Check subscription before choosing the size', async () => {
    await expect(productDetailPage.subscriptionService).toBeVisible()
    await expect(productDetailPage.addToBasketButtonSubscribe).not.toBeVisible()
  })

  await test.step('Check subscription after choosing the size', async () => {
    await productDetailPage.variantPicker.waitFor()
    await productDetailPage.variantPicker.click({ force: true })
    await productDetailPage.getVariant().click()
    await expect(productDetailPage.addToBasketButtonSubscribe).toBeVisible()
    await productDetailPage.addToBasketButtonSubscribe.click()
    await header.basketNumItems.waitFor()
    await expect(header.basketNumItems).toHaveText('1')
  })

  await test.step('Check subscription for variant not eligible to subscribe', async () => {
    await productDetailPage.variantPicker.waitFor()
    await productDetailPage.variantPicker.click({ force: true })
    await productDetailPage
      .getVariant(PDP_E2E.subscribeNotEligibleVariantId)
      .click()
    await expect(productDetailPage.addToBasketButtonSubscribe).not.toBeVisible()
  })
})

test('C2141757: Verify PDP page title', async ({
  productDetailPage,
  page,
  baseURL,
}) => {
  await productDetailPage.visitPDP(PDP_E2E.regularProductUrl, baseURL as string)
  await productDetailPage.productName.waitFor()
  const productName = await productDetailPage.productName.textContent()
  const pageTitle = await page.title()
  expect(pageTitle).toContain(productName)
})

test('C2171081: Verify PDP Multi-size product Store selector', async ({
  productDetailPage,
  baseURL,
  page,
  countryDetector,
}) => {
  await test.step('Visit Multi-size product PDP and check Store selector is not visible', async () => {
    await productDetailPage.visitPDP(
      PDP_E2E.regularProductUrl,
      baseURL as string,
    )
    await countryDetector.closeModal()
    await productDetailPage.productName.waitFor()
    await productDetailPage.assertStoreSelectorIsVisible(false)
  })
  await test.step('Choose variant and check Store selector is visible', async () => {
    await productDetailPage.variantPicker.waitFor()
    await productDetailPage.variantPicker.click({ force: true })
    await productDetailPage.getVariant().click()
    await page.waitForTimeout(500)
    await productDetailPage.variantAvailabilityComponent.waitFor()
    await productDetailPage.assertStoreSelectorIsVisible(true)
  })
  await test.step('Open Store selector flyout', async () => {
    await productDetailPage.buttonOpenStoreFlyout.click()
    await productDetailPage.assertStoreSelectorFlyoutIsVisible(true, 0)
    await expect(productDetailPage.storeInput).toBeVisible()
    await expect(productDetailPage.storeInput).toBeEnabled()
    await expect(productDetailPage.buttonSearchStore).toBeVisible()
    await expect(productDetailPage.buttonSearchStore).not.toBeEnabled()
  })
  await test.step.skip(
    'Search for a store and check the store list is loaded',
    async () => {
      await productDetailPage.typeStoreName(LOCATION.city)
      await expect(productDetailPage.buttonSearchStore).toBeEnabled()
      await productDetailPage.buttonSearchStore.click()
      await productDetailPage.locationStoreList.waitFor()
      await expect(
        productDetailPage.locationStoreListItem.first(),
      ).toBeVisible()
      await expect(productDetailPage.buttonChooseStore).not.toBeEnabled()
    },
  )
  await test.step.skip('Choose the store and close the flyout', async () => {
    await productDetailPage.locationStoreListItem.first().click()
    await expect(productDetailPage.buttonChooseStore).toBeEnabled()
    await productDetailPage.buttonChooseStore.click()
    await productDetailPage.assertStoreSelectorFlyoutIsVisible(false, 0)
  })
})

test('C2171109: Verify PDP One-size product Store selector', async ({
  productDetailPage,
  baseURL,
  countryDetector,
}) => {
  await test.step('Visit One-size product PDP and check Store selector is visible by default', async () => {
    await productDetailPage.visitPDP(
      PDP_E2E.oneSizeProductUrl,
      baseURL as string,
    )
    await countryDetector.closeModal()
    await productDetailPage.productName.waitFor()
    await productDetailPage.assertStoreSelectorIsVisible(true)
  })
})

test('C2181798: Verify PDP URL Variant ID parameter for multi-size available variant', async ({
  productDetailPage,
  baseURL,
  countryDetector,
  page,
}) => {
  await test.step('Visit multi-size product PDP with available variants', async () => {
    await productDetailPage.visitPDP(
      PDP_TEST_VARIANT_ID.multiSizeProductUrl,
      baseURL as string,
    )
    await countryDetector.closeModal()
    await productDetailPage.variantPicker.waitFor()
    expect(page.url()).not.toContain('variantId')
  })
  await test.step('Choose available variant and assert page URL parameter', async () => {
    await productDetailPage.variantPicker.click({ force: true })
    await productDetailPage
      .getVariant(PDP_TEST_VARIANT_ID.availableVariantId)
      .click()
    await page.waitForTimeout(500)
    expect(page.url()).toContain(
      `variantId=${PDP_TEST_VARIANT_ID.availableVariantId}`,
    )
    await expect(productDetailPage.variantPicker).toContainText(
      PDP_TEST_VARIANT_ID.availableSize,
    )
  })
  await test.step('Choose another available variant and assert page URL parameter', async () => {
    await productDetailPage.variantPicker.click({ force: true })
    await page.waitForLoadState('domcontentloaded')
    await productDetailPage
      .getVariant(PDP_TEST_VARIANT_ID.availableVariantId2 as string)
      .focus()
    await productDetailPage
      .getVariant(PDP_TEST_VARIANT_ID.availableVariantId2 as string)
      .click()
    await page.waitForTimeout(500)
    await page.waitForLoadState('domcontentloaded')
    expect(page.url()).toContain(
      `variantId=${PDP_TEST_VARIANT_ID.availableVariantId2}`,
    )
    await expect(productDetailPage.variantPicker).toContainText(
      PDP_TEST_VARIANT_ID.availableSize2,
    )
  })
})

test('C2181801: Verify PDP URL Variant ID parameter for one-size product', async ({
  productDetailPage,
  baseURL,
  countryDetector,
  page,
  search,
  mobileNavigation,
}) => {
  await test.step('Visit one-size available product PDP and check URL parameter', async () => {
    await productDetailPage.visitPDP(
      PDP_TEST_VARIANT_ID.oneSizeProductUrl,
      baseURL as string,
    )
    await countryDetector.closeModal()
    await productDetailPage.variantPicker.waitFor()
    expect(page.url()).not.toContain('variantId')
  })
  await test.step('Search for exact variant ID and check PDP URL parameter', async () => {
    if (isMobile(page)) {
      await mobileNavigation.startTypingMobileSearch(
        PDP_TEST_VARIANT_ID.oneSizeVariantId,
        true,
      )
      await mobileNavigation.searchInputField.nth(0).press('Enter')
      await mobileNavigation.sideNavigationButton.click()
      await page.waitForLoadState('networkidle')
    } else {
      await search.startTypingSearch(PDP_TEST_VARIANT_ID.oneSizeVariantId)
      await search.searchInput.nth(1).press('Enter')
      await page.waitForLoadState('networkidle')
    }
    await page.waitForTimeout(500)
    await productDetailPage.variantPicker.waitFor()
    await search.assertUrlIsLoaded(PDP_TEST_VARIANT_ID.oneSizeProductUrl2)
    expect(page.url()).not.toContain('variantId')
  })
})

test('C2181799: Verify PDP URL Variant ID parameter for multi-size sold-out variant', async ({
  productDetailPage,
  baseURL,
  countryDetector,
  page,
}) => {
  await productDetailPage.visitPDP(
    PDP_TEST_VARIANT_ID.soldOutVariantUrl,
    baseURL as string,
  )
  await countryDetector.closeModal()
  await productDetailPage.variantPicker.waitFor()
  expect(page.url()).toContain('variantId')
  await expect(productDetailPage.addToBasketButton).toBeDisabled()
  await expect(productDetailPage.variantPicker).toContainText(
    PDP_TEST_VARIANT_ID.soldOutVariantSize,
  )
})

test('C2141150 Verify PDP SEO data', async ({
  productDetailPage,
  countryDetector,
  page,
  baseURL,
}) => {
  await productDetailPage.visitPDP(PDP_E2E.regularProductUrl, baseURL as string)
  await countryDetector.closeModal()
  await productDetailPage.h1.waitFor()
  const pageTitle = (await productDetailPage.pageTitle.textContent()) as string

  await verifySeoMetaTags(page, {
    title: PDP_E2E.seoTitle,
    robots: PDP_E2E.seoRobots,
    description: PDP_E2E.seoDescription,
    canonical: baseURL + HOMEPAGE_PATH_DE + PDP_E2E.regularProductUrl,
  })
  await expect(productDetailPage.h1).toBeAttached()
  await expect(productDetailPage.h1).toContainText(pageTitle)
})
