import Search from '../../pageObjects/components/search'
import HomePage from '../../pageObjects/homePage'
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

  afterEach(() => cy.clearSiteData())

  it('check that header and footer is displayed on Search Result Page', () => {
    Search.typeSearchQuery('shirt{enter}')
    Header.assertHeaderIsDisplayed()
    Footer.assertFooterIsDisplayed()
    Footer.assertFooterText()
  })

  if (Cypress.env().mobile !== true) {
    it.skip('Check search Field - clean text button', () => {
      const searchQuery = 'test'
      Search.checkSearchIconDisplayed()
      Search.typeSearchQuery(searchQuery)
      Search.clickCloseSearchButton()
      Search.checkSearchIconDisplayed()
    })
  }
})
