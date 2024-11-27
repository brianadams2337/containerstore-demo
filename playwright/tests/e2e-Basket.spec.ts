import { expect, test } from '../fixtures/fixtures'
import { getUserForBrowser } from '../support/utils'
import {
  BASKET_TEST_DATA,
  E2E_BASKET_URL,
  HOMEPAGE_PATH_DE,
} from '../support/constants'

test('C2132186 C2132187 Verify Basket empty state as a guest and logged in user', async ({
  homePage,
  header,
  basketPage,
  signinPage,
  page,
  countryDetector,
}, testInfo) => {
  await test.step('Verify guest user', async () => {
    await homePage.visitPage()
    await countryDetector.closeModal()
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
      const projectName = testInfo.project.name
      const { email, password } = getUserForBrowser(projectName)
      await signinPage.fillLoginData(email, password)
      await signinPage.clickLoginButton()
      await page.waitForURL(HOMEPAGE_PATH_DE)
      await header.headerBasketButton.click()
      await basketPage.assertContinueButton()
      await expect(basketPage.loginButton).not.toBeVisible()
    }).toPass()
  })
})

test('C2132198 Verify add to Basket', async ({
  homePage,
  header,
  basketPage,
  countryDetector,
  signinPage,
  page,
}, testInfo) => {
  await test.step('Add product to Basket', async () => {
    await expect(async () => {
      await homePage.visitPage()
      await countryDetector.closeModal()
      await basketPage.addProductToBasket(
        BASKET_TEST_DATA.productRegularVariantId,
        1,
      )
      await header.visitBasketPage()
      await page.waitForLoadState('domcontentloaded')
      await expect(header.basketNumItems).toHaveText('1')
    }).toPass()
  })

  await test.step('Assert product is in Basket', async () => {
    await expect(async () => {
      await basketPage.assertProductIsInBasket(
        BASKET_TEST_DATA.productRegularBrand,
        BASKET_TEST_DATA.productRegularName,
      )
    }).toPass()
  })

  await test.step('Log in and assert the product is still in Basket', async () => {
    await header.headerLoginButton.click()
    const projectName = testInfo.project.name
    const { email, password } = getUserForBrowser(projectName)
    await signinPage.fillLoginData(email, password)
    await header.visitBasketPage()

    await expect(async () => {
      await basketPage.assertProductIsInBasket(
        BASKET_TEST_DATA.productRegularBrand,
        BASKET_TEST_DATA.productRegularName,
      )
    }).toPass()
  })

  await test.step('Remove product from Basket', async () => {
    await expect(async () => {
      await basketPage.removeItemFromBasket()
      await expect(header.basketNumItems).not.toBeVisible()
    }).toPass()
  })
})
