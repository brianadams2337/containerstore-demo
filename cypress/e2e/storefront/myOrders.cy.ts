import HomePage from '../../pageObjects/homePage'
import MyOrdersPage from '../../pageObjects/myOrdersPage'
import Header from '../../pageObjects/components/header'
import Footer from '../../pageObjects/components/footer'
import { TEST_ORDER } from '../../support/constants'
import SignInPage from '../../pageObjects/signInPage'

describe(`my orders`, { testIsolation: false }, () => {
  before(() => {
    HomePage.open()
    HomePage.waitForPageToBeDisplayed()
    Header.clickOnSignInButton()
    SignInPage.waitForPageToBeDisplayed()
    SignInPage.login()
    HomePage.waitForPageToBeDisplayed()
    Header.clickOnAccountSettingsButton()
    MyOrdersPage.open()
  })

  after(() => {
    cy.clearSiteData()
  })

  it('Go to my orders > List with orders is shown', () => {
    Header.assertHeaderIsDisplayed()
    MyOrdersPage.waitForMyOrdersPageIsDisplayed()
    Footer.assertFooterIsDisplayed()
  })

  it('Date, number of order and number of items are shown', () => {
    MyOrdersPage.assertDelivery(TEST_ORDER.delivery)
  })

  it('Delivery estimation is shown', () => {
    MyOrdersPage.assertDelivery(TEST_ORDER.deliveryStartDate)
    MyOrdersPage.assertDelivery(TEST_ORDER.deliveryEndDate)
  })
  it('Delivery address is shown', () => {
    MyOrdersPage.assertAddress(TEST_ORDER.address)
  })
  it('List with items is shown: Price is shown; Size is shown', () => {
    MyOrdersPage.assertItem(TEST_ORDER.price)
    MyOrdersPage.assertItem(TEST_ORDER.size)
  })

  it('Quantity is shown', () => {
    MyOrdersPage.assertItem(TEST_ORDER.quantity)
  })

  it('Delivery cost is shown', () => {
    cy.contains(TEST_ORDER.deliveryCost)
  })

  it('Total price is shown', () => {
    MyOrdersPage.assertTotalPrice(TEST_ORDER.price)
  })

  it('Payment method is shown', () => {
    cy.contains(TEST_ORDER.paymentMethod)
  })
})
