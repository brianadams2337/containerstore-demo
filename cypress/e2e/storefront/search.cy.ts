import Search from '../../pageObjects/components/search'
import ProductListingPage from '../../pageObjects/productListingPage'
import HomePage from '../../pageObjects/homePage'
import ProductPage from '../../pageObjects/productPage'
import { TEST_ITEM_REGULAR } from '../../support/constants'
import { getLocaleFile } from '../../test-helpers'
import Header from '../../pageObjects/components/header'
import Footer from '../../pageObjects/components/footer'

describe(`Search:`, () => {
  beforeEach(() => {
    HomePage.open()
    HomePage.waitForPageToBeDisplayed()
    Search.openSearch()
    // This is a workaround for when using this Search input on mobile and running the tests in headless mode(cy:run). Otherwise there's a possibility to trigger an ResizeObserver loop limit exceeded error. As mentioned here: https://github.com/cypress-io/cypress/issues/8418
    Cypress.on('uncaught:exception', (_err, _runnable) => {
      // returning false here prevents Cypress from failing the test
      return false
    })
  })

  afterEach(() => {
    cy.clearSiteData()
  })

  it('check that header and footer is displayed on Search Result Page', () => {
    Search.typeSearchQuery('pullover{enter}')
    Header.assertHeaderIsDisplayed()
    Footer.assertFooterIsDisplayed()
    Footer.assertFooterText()
  })

  it('Check that Search results return test items', () => {
    Search.typeSearchQuery('pullover{enter}')
    ProductListingPage.waitForPageToBeDisplayed()
    // cy.contains(TEST_ITEM_SALE.name)
    cy.contains(TEST_ITEM_REGULAR.name)
  })

  it('Check that header contain Search query', () => {
    Search.typeSearchQuery('pullover{enter}')
    ProductListingPage.waitForPageToBeDisplayed()
    ProductListingPage.assertHeaderName('pullover')
    const expectedStr = getLocaleFile()
      .search.result.replace('{resultsCount}', 8)
      .replace('{term}', 'pullover')
    ProductListingPage.assertHeaderName(expectedStr)
  })

  it('Check redirect back to search result works', () => {
    Search.typeSearchQuery('pullover{enter}')
    ProductListingPage.waitForPageToBeDisplayed()
    // cy.contains(TEST_ITEM_SALE.name)
    cy.contains(TEST_ITEM_REGULAR.name)
    ProductListingPage.openProductByIndex(0)
    ProductPage.waitForPageToBeDisplayed()
    ProductPage.clickBackButton()
    ProductListingPage.waitForPageToBeDisplayed()
    // cy.contains(TEST_ITEM_SALE.name)
    cy.contains(TEST_ITEM_REGULAR.name)
  })

  it('Check no results window', () => {
    const wrongSearchQuery = '1234123412341234124'
    Search.typeSearchQuery(`${wrongSearchQuery}{enter}`)
    ProductListingPage.assertHeaderName(wrongSearchQuery)
    const expectedStr = getLocaleFile()
      .search.result.replace('{resultsCount}', 0)
      .replace('{term}', wrongSearchQuery)
    ProductListingPage.assertHeaderName(expectedStr)
    ProductListingPage.getTotalItems().should('not.exist')
  })

  if (Cypress.env().mobile !== true) {
    it.skip('Check search Field - clean text button', () => {
      const searchQuery = 'test'
      Search.checkSearchIconDisplayed()
      Search.typeSearchQuery(searchQuery)
      Search.clickCrossButton()
      Search.checkSearchIconDisplayed()
    })
  }

  it('Check that sold out product is absent on search results', () => {
    const soldOutProductName = 'SOLDOUT'
    Search.typeSearchQuery(`${soldOutProductName}{enter}`)
    ProductListingPage.assertHeaderName(soldOutProductName)
    const expectedStr = getLocaleFile()
      .search.result.replace('{resultsCount}', 0)
      .replace('{term}', soldOutProductName)
    ProductListingPage.assertHeaderName(expectedStr)
    ProductListingPage.getTotalItems().should('not.exist')
  })
})
