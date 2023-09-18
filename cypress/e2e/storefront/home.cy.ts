import HomePage from '../../pageObjects/homePage'
import Header from '../../pageObjects/components/header'
import Footer from '../../pageObjects/components/footer'
import ProductListingPage from '../../pageObjects/productListingPage'
import { TEST_ITEM_SOLDOUT } from '../../support/constants'
import ProductPage from '../../pageObjects/productPage'

describe(`my orders`, () => {
  beforeEach(() => {
    HomePage.open()
    HomePage.waitForPageToBeDisplayed()
    cy.scrollTo('bottom', { duration: 4000 })
  })

  afterEach(() => {
    cy.clearSiteData()
  })

  it('Sold out product should be clickable on products slider', () => {
    Header.assertHeaderIsDisplayed()
    Footer.assertFooterIsDisplayed()
    ProductListingPage.openProductByID(TEST_ITEM_SOLDOUT.id)
    ProductPage.waitForPageToBeDisplayed()
  })
})

if (Cypress.env().mobile !== true) {
  describe(`country switch`, () => {
    beforeEach(() => {
      HomePage.open()
      HomePage.waitForPageToBeDisplayed()
    })

    afterEach(() => {
      cy.clearSiteData()
    })

    it('check country switch', () => {
      cy.get(HomePage.pageElements.countrySwitcher).then((lang) => {
        const initialLanguage = lang.text()
        cy.get(HomePage.pageElements.countrySwitcher).click()

        const credentials = Cypress.config('baseUrl')!.split('@')[0] + '@'
        cy.get(HomePage.pageElements.languageOption)
          .invoke('attr', 'href')
          .then((href) => {
            const newUrl = href!.replace('https://', credentials)
            cy.visit(newUrl)
          })

        cy.get(HomePage.pageElements.countrySwitcher).then((newLanguage) => {
          expect(initialLanguage).not.eq(newLanguage.text())
        })
      })
    })
  })
}
