import {
  TEST_ITEM_COMBINE_WITH,
  TEST_ITEM_NO_COMBINE_WITH,
  TEST_ITEM_ONESIZE,
  TEST_ITEM_REGULAR,
  TEST_ITEM_SALE,
  TEST_ITEM_SOLDOUT,
  TEST_ITEM_WITH_FREE_GIFT,
} from '../../support/constants'
import ProductPage from '../../pageObjects/productPage'
import HomePage from '../../pageObjects/homePage'
import Header from '../../pageObjects/components/header'
import { getLocaleFile } from '../../test-helpers'
import Footer from '../../pageObjects/components/footer'
import WishlistPage from '../../pageObjects/wishlistPage'
import BasketPage from '../../pageObjects/basketPage'

const locale = getLocaleFile()

describe('Products testing', () => {
  afterEach(() => {
    cy.clearSiteData()
  })

  it('check that header and footer is displayed PDP Page', () => {
    ProductPage.openProduct(TEST_ITEM_REGULAR.link)
    ProductPage.waitForPageToBeDisplayed()
    Header.assertHeaderIsDisplayed()
    Footer.assertFooterIsDisplayed()
    Footer.assertFooterText()
  })

  it('check base fields presence on PDP page', () => {
    ProductPage.openProduct(TEST_ITEM_REGULAR.link)
    ProductPage.waitForPageToBeDisplayed()
    ProductPage.assertTimerbox()
    const locale = getLocaleFile()
    cy.contains(locale.pdp.add_label)
    cy.contains(locale.pdp.product_info_heading)
    cy.contains(locale.pdp.shipping_return_heading)
    cy.contains(locale.pdp.composition_care_heading)
  })

  it('Click on product image in basket', () => {
    ProductPage.openProduct(TEST_ITEM_REGULAR.link)
    ProductPage.waitForPageToBeDisplayed()
    ProductPage.selectAvailableSize()
    Header.assertShoppingBagCounter(0)
    ProductPage.addToCart()
    Header.clickOnBasketButton()
    BasketPage.waitForPageToBeDisplayed()
    BasketPage.assertThatProductIsPresent()
    Header.assertShoppingBagCounter(1)
    BasketPage.clickOnProductImage()
    ProductPage.waitForPageToBeDisplayed()
    if (Cypress.env().mobile !== true) {
      ProductPage.assertTilledGalleryIsDisplayed()
      ProductPage.clickOnProductImage()
      ProductPage.clickCloseButton()
    }
  })

  it('Check product with free gift', () => {
    ProductPage.openProduct(TEST_ITEM_WITH_FREE_GIFT.link)
    ProductPage.waitForPageToBeDisplayed()
    ProductPage.assertProductGiftItemsIfConditionsMet()
    ProductPage.selectAvailableSize()
    ProductPage.addToCart()
    ProductPage.assertProductGiftIfConditionsMet()
  })

  const products = [
    TEST_ITEM_REGULAR,
    TEST_ITEM_SOLDOUT,
    TEST_ITEM_SALE,
    // TEST_ITEM_COMBINE_WITH,
    TEST_ITEM_NO_COMBINE_WITH,
  ]
  products.forEach((testItem) => {
    it(`Product -  ${testItem.name.slice(13)}`, () => {
      ProductPage.openProduct(testItem.link)
      ProductPage.waitForPageToBeDisplayed()
      cy.log('check product name')
      ProductPage.assertProductName(testItem.name)

      cy.log('check product price')
      ProductPage.assertProductPrice(testItem.price)

      cy.log('check initial product price for product that is in Sale')
      if (testItem.initialPrice) {
        ProductPage.assertProductPrice(testItem.initialPrice)
      }

      cy.log('check size selector is shown')
      ProductPage.assertSizePresent()

      if (testItem === TEST_ITEM_SOLDOUT) {
        cy.log('check that add to cart is disabled of product is sold out')
        ProductPage.isAddToCartDisabled()
      }

      if (testItem === TEST_ITEM_COMBINE_WITH) {
        cy.log('check that combine with slider is displayed')
        ProductPage.isCombineWithSliderDisplayed()
        cy.log('check that sold out product is missing in combine with slider')
        // ProductPage.isSoldOutProductNotDisplayedInCombineWithSlider()
      }

      if (testItem === TEST_ITEM_NO_COMBINE_WITH) {
        cy.log('check that combine with slider is not displayed')
        ProductPage.isCombineWithSliderNotDisplayed()
      }
    })
  })
})

// ToDo: unskip the test after fix SCPF-4397 https://aboutyou.atlassian.net/browse/SCPF-4397
describe.skip('SoldOut product', () => {
  afterEach(() => {
    cy.clearSiteData()
  })

  it('check Sold Out field presence on PDP page', () => {
    ProductPage.openProduct(TEST_ITEM_SOLDOUT.link)
    ProductPage.waitForPageToBeDisplayed()
    cy.contains(getLocaleFile().availability.not_available)
  })

  // ToDo: Skipped due to the SAPI issue
  it.skip('check that Sold Out product can be added to wishlist', () => {
    ProductPage.openProduct(TEST_ITEM_SOLDOUT.link)
    ProductPage.waitForPageToBeDisplayed()
    ProductPage.addProductToWishlist()
    Header.wishlistAssertProductCount(1)
    Header.clickOnWishlistButton()
    WishlistPage.waitForPageToBeDisplayed()
    WishlistPage.assertThatProductIsPresent()
  })

  it('Add product to a basket without size from Product Detail Page', () => {
    ProductPage.openProduct(TEST_ITEM_REGULAR.link)
    ProductPage.waitForPageToBeDisplayed()
    ProductPage.addToCart()
    cy.contains(locale.basket.notification.select_size)
  })

  it('Add one-size product to a basket from Product Detail Page', () => {
    ProductPage.openProduct(TEST_ITEM_ONESIZE.link)
    ProductPage.waitForPageToBeDisplayed()
    ProductPage.addToCart()
    Header.clickOnBasketButton()
    BasketPage.waitForPageToBeDisplayed()
    BasketPage.assertThatProductIsPresent()
  })

  it('Homepage redirect', () => {
    ProductPage.openProduct(TEST_ITEM_REGULAR.link)
    ProductPage.waitForPageToBeDisplayed()
    ProductPage.clickShopLogo()
    HomePage.open()
  })

  it('Click on sibling color on PDP', () => {
    ProductPage.openProduct(TEST_ITEM_REGULAR.link)
    ProductPage.waitForPageToBeDisplayed()
    ProductPage.assertSiblingColorsSelector()
    ProductPage.clickSiblingColorBlue()
  })
})
