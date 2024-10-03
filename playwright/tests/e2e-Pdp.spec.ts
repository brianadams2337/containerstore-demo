import { expect, test } from '../fixtures/fixtures'
import { PDP_E2E } from '../support/constants'

test('C2141594: Verify PDP name, brand and price for regular product', async ({
  productDetailPage,
  baseURL,
}) => {
  await productDetailPage.visitPDP(PDP_E2E.regularProductUrl, baseURL as string)
  await expect(async () => {
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
}) => {
  await productDetailPage.visitPDP(PDP_E2E.regularProductUrl, baseURL as string)
  const productName = await productDetailPage.productName.textContent()

  await expect(async () => {
    await productDetailPage.variantPicker.waitFor()
    await productDetailPage.variantPicker.click()
    await productDetailPage.getVariant(PDP_E2E.regularProductVariantId).click()
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
}) => {
  await productDetailPage.visitPDP(PDP_E2E.oneSizeProductUrl, baseURL as string)
  const productName = await productDetailPage.productName.textContent()

  await productDetailPage.addProductToBasket()
  await expect(header.basketNumItems).toHaveText('1')
  await expect(toastMessage.toastInfo).toBeVisible()
  await expect(toastMessage.toastInfo).toContainText(productName as string)
})

test('C2141597: Verify PDP quantity selector', async ({
  productDetailPage,
  baseURL,
  header,
  page,
}) => {
  await productDetailPage.visitPDP(PDP_E2E.oneSizeProductUrl, baseURL as string)
  await page.waitForLoadState('domcontentloaded')

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
}) => {
  await productDetailPage.visitPDP(PDP_E2E.regularProductUrl, baseURL as string)
  await page.waitForLoadState('domcontentloaded')

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
}) => {
  await productDetailPage.visitPDP(
    PDP_E2E.subscribeProductUrl,
    baseURL as string,
  )
  await page.waitForLoadState('domcontentloaded')

  await test.step('Check subscription before choosing the size', async () => {
    await expect(productDetailPage.subscriptionService).toBeVisible()
    await expect(productDetailPage.addToBasketButtonSubscribe).not.toBeVisible()
  })

  await test.step('Check subscription after choosing the size', async () => {
    await productDetailPage.variantPicker.waitFor()
    await productDetailPage.variantPicker.click()
    await productDetailPage
      .getVariant(PDP_E2E.subscribeProductVariantId)
      .click()
    await expect(productDetailPage.addToBasketButtonSubscribe).toBeVisible()
    await productDetailPage.addToBasketButtonSubscribe.click()
    await header.basketNumItems.waitFor()
    await expect(header.basketNumItems).toHaveText('1')
  })

  await test.step('Check subscription for variant not eligible to subscribe', async () => {
    await productDetailPage.variantPicker.waitFor()
    await productDetailPage.variantPicker.click()
    await productDetailPage
      .getVariant(PDP_E2E.subscribeNotEligibleVariantId)
      .click()
    await expect(productDetailPage.addToBasketButtonSubscribe).not.toBeVisible()
  })
})
