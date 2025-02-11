import { expect, test } from '../fixtures/fixtures'
import { PDP_E2E, LOCATION } from '../support/constants'

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
  await test.step('Enter store name', async () => {
    await productDetailPage.typeStoreName(LOCATION.city)
    await expect(productDetailPage.buttonSearchStore).toBeEnabled()
  })
})
