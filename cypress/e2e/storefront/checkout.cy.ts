import CheckoutPage from '../../pageObjects/checkoutPage'
import { TEST_ITEM_REGULAR } from '../../support/constants'
import ProductPage from '../../pageObjects/productPage'
import Header from '../../pageObjects/components/header'
import BasketPage from '../../pageObjects/basketPage'

describe('Checkout:', () => {
  beforeEach(() => cy.clearSiteData())

  if (Cypress.env().mobile !== true) {
    it('Check that checkout is opened in Iframe', function () {
      ProductPage.openProduct(TEST_ITEM_REGULAR.link)
      ProductPage.waitForPageToBeDisplayed()
      ProductPage.selectAvailableSize()
      ProductPage.addToCart()
      Header.clickOnBasketButton()
      BasketPage.waitForPageToBeDisplayed()
      BasketPage.assertThatProductIsPresent()
      Header.assertShoppingBagCounter(1)
      BasketPage.clickCheckoutButton()
      CheckoutPage.waitForPageToBeDisplayed()
    })
  }
})
