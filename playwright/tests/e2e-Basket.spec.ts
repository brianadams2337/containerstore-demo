import { expect, test } from '../fixtures/fixtures'
import { getUserForBrowser, isMobile } from '../support/utils'
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
  test.setTimeout(60000)
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
      await header.headerBasketButton.waitFor()
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

test('C2167319 Verify Basket Price summary - regular product', async ({
  homePage,
  header,
  basketPage,
  countryDetector,
  page,
}) => {
  await test.step('Add regular product to Basket', async () => {
    await expect(async () => {
      await homePage.visitPage()
      await countryDetector.closeModal()
      await basketPage.addProductToBasket(
        BASKET_TEST_DATA.regularPriceVariantId,
        1,
      )
      await header.visitBasketPage()
      await page.waitForLoadState('domcontentloaded')
      await expect(header.basketNumItems).toHaveText('1')
    }).toPass()
  })
  await test.step('Check regular product price summary', async () => {
    if (isMobile(page)) {
      await basketPage.priceFinal.nth(1).waitFor()
      await basketPage.assertBasketPriceSummary(
        basketPage.priceSubtotal,
        basketPage.priceFinal,
        true,
      )
    } else {
      await basketPage.priceFinal.nth(0).waitFor()
      await basketPage.assertBasketPriceSummary(
        basketPage.priceSubtotal,
        basketPage.priceFinal,
        false,
      )
    }
  })
})

test('C2167320 Verify Basket Price summary - sale product', async ({
  homePage,
  header,
  basketPage,
  countryDetector,
  page,
}) => {
  await test.step('Add sale product to Basket', async () => {
    await expect(async () => {
      await homePage.visitPage()
      await countryDetector.closeModal()
      await basketPage.addProductToBasket(
        BASKET_TEST_DATA.salePriceVariantId,
        1,
      )
      await header.visitBasketPage()
      await page.waitForLoadState('domcontentloaded')
      await expect(header.basketNumItems).toHaveText('1')
    }).toPass()
  })
  await test.step('Check sale product price summary', async () => {
    if (isMobile(page)) {
      await basketPage.priceFinal.nth(1).waitFor()
      await basketPage.assertBasketPriceSummary(
        basketPage.priceSubtotal,
        basketPage.priceFinal,
        true,
        basketPage.discountSale,
      )
    } else {
      await basketPage.priceFinal.nth(0).waitFor()
      await basketPage.assertBasketPriceSummary(
        basketPage.priceSubtotal,
        basketPage.priceFinal,
        false,
        basketPage.discountSale,
      )
    }
  })
})

test('C2167321 Verify Basket Price summary - promotion product', async ({
  homePage,
  header,
  basketPage,
  countryDetector,
  search,
  page,
  mobileNavigation,
  productDetailPage,
}) => {
  await test.step('Add promotion product to Basket', async () => {
    await expect(async () => {
      await homePage.visitPage()
      await countryDetector.closeModal()
      if (isMobile(page)) {
        await mobileNavigation.startTypingMobileSearch(
          BASKET_TEST_DATA.promotionPriceProductId,
          true,
        )
        await mobileNavigation.productListItem.click()
        await mobileNavigation.sideNavigationButton.click()
        await page.waitForLoadState('networkidle')
      } else {
        await search.startTypingSearch(BASKET_TEST_DATA.promotionPriceProductId)
        await search.clickExactProductItem()
      }
      await expect(async () => {
        await productDetailPage.variantPicker.waitFor()
        await productDetailPage.variantPicker.click({ force: true })
        await productDetailPage.getVariant().click()
        await productDetailPage.addProductToBasket()
      }).toPass()
      await header.visitBasketPage()
      await page.waitForLoadState('domcontentloaded')
      await expect(header.basketNumItems).toHaveText('1')
    }).toPass()
  })
  await test.step('Check promotion product price summary', async () => {
    if (isMobile(page)) {
      await basketPage.promotionSummaryToggleButton.nth(1).waitFor()
      await basketPage.assertBasketPriceSummary(
        basketPage.priceSubtotal,
        basketPage.priceFinal,
        true,
        basketPage.totalPromotionDiscount,
      )
    } else {
      await basketPage.promotionSummaryToggleButton.nth(0).waitFor()
      await basketPage.assertBasketPriceSummary(
        basketPage.priceSubtotal,
        basketPage.priceFinal,
        false,
        basketPage.totalPromotionDiscount,
      )
    }
  })
})
