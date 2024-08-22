import { expect, test } from '../fixtures/fixtures'

import {
  BASKET_TEST_DATA,
  E2E_BASKET_URL,
  HOMEPAGE_PATH_DE,
  LOGGED_IN_USER_DATA,
} from '../support/constants'

test.describe.configure({ mode: 'serial' })

test('C2132186 C2132187 Verify Basket empty state as a guest and logged in user', async ({
  homePage,
  header,
  basketPage,
  signinPage,
  page,
}) => {
  await test.step('Verify guest user', async () => {
    await homePage.visitPage()
    await header.headerBasketButton.click()
    await page.waitForURL(E2E_BASKET_URL)

    const pageUrl = page.url()
    const basketUrl = E2E_BASKET_URL.source.replace(/\\/g, '')
    const basketTitleText = await basketPage.basketTitle.textContent()
    const basketSubTitleText = await basketPage.basketSubTitle.textContent()

    await expect(async () => {
      expect(pageUrl).toContain(basketUrl)
      expect(basketTitleText).toEqual(BASKET_TEST_DATA.emptyBasketTitleDE)
      expect(basketSubTitleText).toEqual(BASKET_TEST_DATA.emptyBasketSubtitleDE)
    }).toPass()
  })

  await test.step('Verify logged-in user', async () => {
    await expect(async () => {
      await basketPage.assertContinueButton()
      await header.headerBasketButton.click()
      await basketPage.assertLoginButton()
    }).toPass()

    await expect(async () => {
      await signinPage.fillLoginData(
        LOGGED_IN_USER_DATA.email,
        LOGGED_IN_USER_DATA.password,
      )
      await signinPage.clickLoginButton()
      await page.waitForURL(HOMEPAGE_PATH_DE)

      await header.headerBasketButton.click()
      await basketPage.assertContinueButton()
      await expect(basketPage.loginButton).not.toBeVisible()
    }).toPass()
  })
})

test('C2132198 Verify add to Basket as a guest user', async ({
  homePage,
  header,
  basketPage,
}) => {
  await expect(async () => {
    await homePage.visitPage()
    await basketPage.addProductToBasket(
      BASKET_TEST_DATA.productRegularVariantId,
      1,
    )
    await header.visitBasketPage()

    await expect(header.basketNumItems).toHaveText('1')
    await basketPage.assertProductIsInBasket(
      BASKET_TEST_DATA.productRegularBrand,
      BASKET_TEST_DATA.productRegularName,
    )
  }).toPass()
})

test('C2132199 Verify add to Basket as a logged in user', async ({
  homePage,
  header,
  basketPage,
  signinPage,
  page,
}) => {
  await test.step('Deleting Basket items to have a clean state', async () => {
    await expect(async () => {
      await homePage.visitPage()

      await header.clickLoginHeaderButton()
      await signinPage.fillLoginData(
        LOGGED_IN_USER_DATA.email,
        LOGGED_IN_USER_DATA.password,
      )
      await signinPage.clickLoginButton()
      await page.waitForURL(HOMEPAGE_PATH_DE)
      await basketPage.emptyBasket(BASKET_TEST_DATA.itemKeyBasketE2E)
      await basketPage.emptyBasket(BASKET_TEST_DATA.itemKeyHappyPath)
    }).toPass()
  })

  await test.step('Adding item to basket and removing it', async () => {
    await expect(async () => {
      await basketPage.addProductToBasket(
        BASKET_TEST_DATA.productRegularVariantId,
        1,
      )
    }).toPass()

    await expect(async () => {
      await header.visitBasketPage()
      await page.reload()

      await page.waitForLoadState('domcontentloaded')
      await expect(header.basketNumItems).toHaveText('1')
      await expect(basketPage.basketProductCard).toBeVisible()
    }).toPass()

    await expect(async () => {
      await basketPage.assertProductIsInBasket(
        BASKET_TEST_DATA.productRegularBrand,
        BASKET_TEST_DATA.productRegularName,
      )
    }).toPass()

    await expect(async () => {
      await basketPage.removeItemFromBasket()
      await expect(header.basketNumItems).not.toBeVisible()
    }).toPass()
  })
})
