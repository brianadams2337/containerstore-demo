import HomePage from '../../pageObjects/homePage'
import { TEST_ITEM_REGULAR } from '../../support/constants'
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

  it('Check promotion banner', () => {
    HomePage.assertPromotionBannerIsDisplayed()
    HomePage.assertTimerBox()
  })
  it('Banner Link should be displayed', () => {
    ProductPage.openProduct(TEST_ITEM_REGULAR.link)
    ProductPage.waitForPageToBeDisplayed()
    ProductPage.selectAvailableSize()
    Cypress._.times(10, () => {
      cy.wait(Math.random() * 1000)
      ProductPage.addToCart()
    })
    if (Cypress.env().mobile) {
      HomePage.assertShowDealsButtonMobileIsDisplayed()
    } else {
      HomePage.assertShowDealsButtonIsDisplayed()
    }
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

    it.skip('check country switch', () => {
      cy.get(HomePage.pageElements.countrySwitcher).then((lang) => {
        const initialLanguage = lang.text()
        cy.get(HomePage.pageElements.countrySwitcher).click({ force: true })

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
