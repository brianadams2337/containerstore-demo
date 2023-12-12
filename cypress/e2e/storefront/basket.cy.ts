import { TEST_ITEM_REGULAR } from '../../support/constants'
import Header from '../../pageObjects/components/header'
import Footer from '../../pageObjects/components/footer'
import ProductListingPage from '../../pageObjects/productListingPage'
import ProductPage from '../../pageObjects/productPage'
import BasketPage from '../../pageObjects/basketPage'
import { getLocaleFile } from '../../test-helpers'
import WishlistPage from '../../pageObjects/wishlistPage'

const locale = getLocaleFile()

describe('Basket Feature', () => {
  afterEach(() => {
    cy.clearSiteData()
  })

  it('check that header and footer is displayed on Basket Page', () => {
    BasketPage.open()
    BasketPage.waitForPageToBeDisplayed()
    Header.assertHeaderIsDisplayed()
    Footer.assertFooterIsDisplayed()
    Footer.assertFooterText()
  })

  it('empty Basket Page content check', () => {
    BasketPage.open()
    BasketPage.waitForPageToBeDisplayed()
    Header.assertShoppingBagCounter(0)
    ProductListingPage.assertHeaderName(locale.basket.empty_title)
    cy.contains(locale.basket.empty_description)
    cy.contains(locale.global.continue_shopping_label)
    cy.contains(locale.global.sign_in_label)
  })

  it('check base fields presence on Basket page', () => {
    ProductPage.openProduct(TEST_ITEM_REGULAR.link)
    ProductPage.waitForPageToBeDisplayed()
    ProductPage.selectAvailableSize()
    Header.assertShoppingBagCounter(0)
    ProductPage.addToCart()
    Header.clickOnBasketButton()
    BasketPage.waitForPageToBeDisplayed()
    BasketPage.assertThatProductIsPresent()
    Header.assertShoppingBagCounter(1)
    cy.log('assert basket base elements')
    cy.contains(locale.basket.total)
    cy.contains(locale.basket.shipping)
    cy.contains(locale.basket.including_vat)
    cy.contains(locale.basket.checkout_label)
    cy.contains(locale.basket.to_checkout)
  })

  it('check product attributes in Basket page', () => {
    ProductPage.openProduct(TEST_ITEM_REGULAR.link)
    ProductPage.waitForPageToBeDisplayed()
    ProductPage.selectAvailableSize()
    Header.assertShoppingBagCounter(0)
    ProductPage.addToCart()
    Header.clickOnBasketButton()
    BasketPage.waitForPageToBeDisplayed()
    BasketPage.assertThatProductIsPresent()
    Header.assertShoppingBagCounter(1)
    cy.log('assert basket card elements')
    cy.contains(locale.basket_card.size_label)
    cy.contains(locale.basket_card.color_label)
    cy.contains(locale.basket_card.remove_label)
  })

  it('add to wishlist from Basket Page', () => {
    ProductPage.openProduct(TEST_ITEM_REGULAR.link)
    ProductPage.waitForPageToBeDisplayed()
    ProductPage.selectAvailableSize()
    Header.assertShoppingBagCounter(0)
    ProductPage.addToCart()
    Header.clickOnBasketButton()
    BasketPage.waitForPageToBeDisplayed()
    BasketPage.assertThatProductIsPresent()
    Header.assertShoppingBagCounter(1)
    BasketPage.addToWishlist(0)
    Header.clickOnWishlistButton()
    WishlistPage.waitForPageToBeDisplayed()
    WishlistPage.assertThatProductIsPresent()
  })

  it('should be able to add an item to the basket and it stays consistent on reload', () => {
    ProductPage.openProduct(TEST_ITEM_REGULAR.link)
    ProductPage.waitForPageToBeDisplayed()
    ProductPage.selectAvailableSize()
    Header.assertShoppingBagCounter(0)
    ProductPage.addToCart()
    Header.clickOnBasketButton()
    BasketPage.waitForPageToBeDisplayed()
    BasketPage.assertThatProductIsPresent()
    Header.assertShoppingBagCounter(1)
    cy.pause()
    cy.log('Checking basket count to stay consistent on reload')
    cy.reload()
    BasketPage.waitForPageToBeDisplayed()
    BasketPage.assertThatProductIsPresent()
  })

  it('should be able to remove item from basket > Click on Remove', () => {
    ProductPage.openProduct(TEST_ITEM_REGULAR.link)
    ProductPage.waitForPageToBeDisplayed()
    ProductPage.selectAvailableSize()
    Header.assertShoppingBagCounter(0)
    ProductPage.addToCart()
    Header.clickOnBasketButton()
    BasketPage.waitForPageToBeDisplayed()
    BasketPage.assertThatProductIsPresent()
    Header.assertShoppingBagCounter(1)
    BasketPage.removeProductFromCart()
    cy.contains(locale.basket.empty_title)
    cy.contains(locale.basket.empty_description)
    cy.contains(locale.global.continue_shopping_label)
    cy.contains(locale.global.sign_in_label)
  })

  // ToDo: unskip the test after fix SCPF-4398 https://aboutyou.atlassian.net/browse/SCPF-4398
  if (Cypress.env().mobile === true) {
    it.skip('should be able to remove item from basket > using swipe', () => {
      ProductPage.openProduct(TEST_ITEM_REGULAR.link)
      ProductPage.waitForPageToBeDisplayed()
      ProductPage.selectAvailableSize()
      Header.assertShoppingBagCounter(0)
      ProductPage.addToCart()
      Header.clickOnBasketButton()
      BasketPage.waitForPageToBeDisplayed()
      BasketPage.assertThatProductIsPresent()
      Header.assertShoppingBagCounter(1)
      BasketPage.removeProductFromCartBySwipe(0)
      cy.contains(locale.basket.empty_title)
      cy.contains(locale.basket.empty_description)
      cy.contains(locale.global.continue_shopping_label)
      cy.contains(locale.global.sign_in_label)
    })
  }

  if (Cypress.env().mobile !== true) {
    it('should be able to remove item from basket > Click on Cancel', () => {
      ProductPage.openProduct(TEST_ITEM_REGULAR.link)
      ProductPage.waitForPageToBeDisplayed()
      ProductPage.selectAvailableSize()
      ProductPage.addToCart()
      Header.clickOnBasketButton()
      BasketPage.waitForPageToBeDisplayed()
      BasketPage.assertThatProductIsPresent()
      BasketPage.clickRemoveItemButton()

      cy.contains(locale.basket_card.confirm_remove_question)
      cy.contains(locale.basket_card.cancel)
      cy.contains(locale.basket_card.remove_long)

      cy.contains(locale.basket_card.cancel).click()
      BasketPage.assertThatProductIsPresent()
    })
  }
})
