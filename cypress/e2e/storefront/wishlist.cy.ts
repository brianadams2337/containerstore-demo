import { cleanText, getLocaleFile, useLoggedInUser } from '../../test-helpers'
import ProductPage from '../../pageObjects/productPage'
import WishlistPage from '../../pageObjects/wishlistPage'
import BasketPage from '../../pageObjects/basketPage'
import Header from '../../pageObjects/components/header'
import { TEST_ITEM_ONESIZE, TEST_ITEM_REGULAR } from '../../support/constants'
import Footer from '../../pageObjects/components/footer'
import HomePage from '../../pageObjects/homePage'

const locale = getLocaleFile()

describe('Wishlist feature', () => {
  beforeEach(() => {
    ProductPage.openProduct(TEST_ITEM_REGULAR.link)
    ProductPage.waitForPageToBeDisplayed()
    HomePage.closePromotionButton()
  })
  afterEach(() => {
    cy.clearSiteData()
  })

  it.only('check that header and footer is displayed on Wishlist Page', () => {
    ProductPage.addProductToWishlist()
    WishlistPage.checkAddToWishlistTrackingEvent()
    Header.wishlistAssertProductCount(1)
    Header.clickOnWishlistButton()
    WishlistPage.waitForPageToBeDisplayed()
    Header.assertHeaderIsDisplayed()
    Footer.assertFooterIsDisplayed()
    Footer.assertFooterText()
  })

  it('should be able to add product to wishlist', () => {
    ProductPage.addProductToWishlist()
    WishlistPage.checkAddToWishlistTrackingEvent()
    Header.wishlistAssertProductCount(1)
    Header.clickOnWishlistButton()
    WishlistPage.waitForPageToBeDisplayed()
  })

  it('should be able to remove product from wishlist', () => {
    ProductPage.addProductToWishlist()
    Header.clickOnWishlistButton()
    WishlistPage.waitForPageToBeDisplayed()
    WishlistPage.assertThatProductIsPresent()
    WishlistPage.assertThatProductPriceIsPresent()
    WishlistPage.clearWishlist()
    Header.wishlistAssertProductCount(0)
  })

  it('add product to the basket from Wishlist', () => {
    ProductPage.addProductToWishlist()
    Header.clickOnWishlistButton()
    WishlistPage.waitForPageToBeDisplayed()
    WishlistPage.assertThatProductIsPresent()
    WishlistPage.assertThatProductPriceIsPresent()
    if (Cypress.env().mobile !== true) {
      WishlistPage.changeProductSizeByIndex(0)
      WishlistPage.addProductToCart(0)
    } else {
      WishlistPage.addProductToCart(0)
      WishlistPage.changeProductSizeByIndex(0)
    }
    BasketPage.open()
    BasketPage.waitForPageToBeDisplayed()
    BasketPage.assertThatProductIsPresent()
  })

  it('should be able to see the name of the wishlist added product on the wishlist page', () => {
    ProductPage.addProductToWishlist()
    ProductPage.getProductName()
      .invoke('text')
      .then((text: string) => {
        Header.clickOnWishlistButton()
        WishlistPage.waitForPageToBeDisplayed()
        WishlistPage.assertThatProductIsPresent()
        cy.contains(cleanText(text))
      })
  })

  // behavior is changed, so test not actual
  it.skip('should be able to add multiple variants to wishlist', () => {
    ProductPage.selectAvailableSize(0)
    ProductPage.addProductToWishlist()
    ProductPage.selectAvailableSize(1)
    ProductPage.addProductToWishlist()
    Header.clickOnWishlistButton()
    WishlistPage.waitForPageToBeDisplayed()
    WishlistPage.assertThatProductIsPresent()
    WishlistPage.assertThatProductPriceIsPresent()
    WishlistPage.assertThatProductSizeIsPresent('S')
    WishlistPage.assertThatProductSizeIsPresent('M')
  })
  if (Cypress.env().mobile !== true) {
    it('should be able to change product size on wishlist', () => {
      // ProductPage.selectAvailableSize(0)
      ProductPage.addProductToWishlist()
      Header.clickOnWishlistButton()
      WishlistPage.waitForPageToBeDisplayed()
      // WishlistPage.assertThatProductSizeIsPresent('M')
      WishlistPage.changeProductSize('S')
      cy.waitForXHR()
      WishlistPage.assertThatProductSizeIsPresent('S')
    })
  }
  // behavior is changed, so test not actual
  it.skip('should be able to add the same variant to the cart', () => {
    ProductPage.selectAvailableSize(0)
    ProductPage.addProductToWishlist()
    ProductPage.selectAvailableSize(1)
    ProductPage.addProductToWishlist()
    Header.wishlistAssertProductCount(2)
    Header.clickOnWishlistButton()
    WishlistPage.waitForPageToBeDisplayed()
    WishlistPage.assertThatAddToCartButtonIsPresent()
    WishlistPage.assertThatProductSizeButtonIsPresent()
    WishlistPage.addProductToCart(1)
    cy.waitForXHR(4000)
    Header.basketAssertProductCount(1)
    WishlistPage.assertThatAddToCartButtonIsPresent()
    WishlistPage.assertThatProductSizeButtonIsPresent()
    WishlistPage.addProductToCart(1) // Add the same variant to the cart
    cy.waitForXHR(4000) // wishlist operations take longer than usual
    Header.basketAssertProductCount(2)
    Header.clickOnBasketButton()
    BasketPage.waitForPageToBeDisplayed()
    BasketPage.assertThatProductIsPresent()
    const expectedStr = getLocaleFile().wishlist.products_count.split('|')[1]
    cy.contains(`2${expectedStr}`)
    BasketPage.assertQuantityCount(2)
  })

  if (Cypress.env().mobile !== true) {
    it('Add product to a basket without size', () => {
      ProductPage.addProductToWishlist()
      WishlistPage.checkAddToWishlistTrackingEvent()
      Header.wishlistAssertProductCount(1)
      Header.clickOnWishlistButton()
      WishlistPage.waitForPageToBeDisplayed()
      WishlistPage.addProductToCart()
      cy.contains(locale.basket.notification.select_size)
    })
  }

  it('Add one-size product to a basket from Wishlist', () => {
    ProductPage.openProduct(TEST_ITEM_ONESIZE.link)
    ProductPage.waitForPageToBeDisplayed()
    ProductPage.addProductToWishlist()
    WishlistPage.checkAddToWishlistTrackingEvent()
    Header.wishlistAssertProductCount(1)
    Header.clickOnWishlistButton()
    WishlistPage.waitForPageToBeDisplayed()
    WishlistPage.addProductToCart()
    Header.clickOnBasketButton()
    BasketPage.waitForPageToBeDisplayed()
    BasketPage.assertThatProductIsPresent()
  })

  it('check buttons on empty wishlist', () => {
    WishlistPage.open()
    WishlistPage.waitForPageToBeDisplayed()
    WishlistPage.assertThatWishlistIsEmpty()
    WishlistPage.assertHeaderText()
    WishlistPage.assertThatContinueShoppingButtonIsPresent()
    WishlistPage.assertThatSignInButtonIsPresent()
  })

  it('check buttons on empty wishlist for logged in user', () => {
    useLoggedInUser()
    ProductPage.openProduct(TEST_ITEM_ONESIZE.link)
    ProductPage.waitForPageToBeDisplayed()
    ProductPage.addProductToWishlist()
    WishlistPage.open()
    WishlistPage.waitForPageToBeDisplayed()
    WishlistPage.clearWishlist()
    WishlistPage.assertThatWishlistIsEmpty()
    WishlistPage.assertHeaderText()
    WishlistPage.assertThatSignInButtonIsNotPresent()
  })
})
