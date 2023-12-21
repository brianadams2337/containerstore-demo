import HomePage from '../../../pageObjects/homePage'
import Header from '../../../pageObjects/components/header'
import ProductListingPage from '../../../pageObjects/productListingPage'
import ProductPage from '../../../pageObjects/productPage'
import BasketPage from '../../../pageObjects/basketPage'
import WishlistPage from '../../../pageObjects/wishlistPage'

describe('From home to checkout a.k.a. "Golden Path"', () => {
  afterEach(() => {
    cy.clearSiteData()
  })

  it('should be able to go from home to checkout with a product in the basket', () => {
    HomePage.open()
    HomePage.closePromotionButton()
    ProductListingPage.openTestCategory()
    cy.log('navigate to PDP by clicking on first product')
    ProductListingPage.waitForPageToBeDisplayed()
    ProductListingPage.openProductByIndex(3)

    cy.log('add product to basket and wishlist and navigate to wishlist page')
    ProductPage.waitForPageToBeDisplayed()
    ProductPage.addProductToWishlist()
    ProductPage.selectAvailableSize()
    ProductPage.addToCart()
    Header.clickOnWishlistButton()

    cy.log('navigate to basket page')
    WishlistPage.waitForPageToBeDisplayed()
    WishlistPage.assertThatProductIsPresent()
    Header.clickOnBasketButton()
    BasketPage.waitForPageToBeDisplayed()
    BasketPage.assertThatProductIsPresent()
  })
})
