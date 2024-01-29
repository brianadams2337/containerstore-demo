import { BasePage } from './basePage'
import Header from './components/header'

class HomePage extends BasePage {
  baseURL = '/'

  pageElements = {
    homePageContent: '[data-test-id="home-page-content"]',
    highlightsProductSlider: '[data-test-id="horizontal-product-slider"]',
    countrySwitcher: '[data-test-id="language-listbox"]',
    languageOption: '[role="option"] button',
  }

  open(waitForDisplayed = true): void {
    cy.visitAndWait(this.baseURL)
    if (waitForDisplayed) {
      this.waitForPageToBeDisplayed()
    }
  }

  waitForPageToBeDisplayed(): void {
    Header.assertHeaderIsDisplayed()
    cy.get(this.pageElements.homePageContent).should('be.visible')
  }

  clickInCountrySwitcher() {
    cy.get(this.pageElements.countrySwitcher).click()
  }

  selectCountryByIndex(index = 0) {
    cy.get(this.pageElements.languageOption).eq(index).click()
  }

  closePromotionButton() {
    // NOTE: Needs to be conditional, as promotions are always time limited,
    // thus it's possible that during a test run, no valid promotion is available
    // and no promotion banner, nor promotion countdown is rendered.
    cy.get('body').then(($body) => {
      if ($body.find('[data-test-id="promotion-banner"]').length) {
        cy.get('[data-test-id="promotion-banner"]').should('be.visible')
        cy.get('[data-test-id="close-promotion-button"]').click()
        cy.get('[data-test-id="promotion-list"]').should('not.be.visible')
      }
    })
  }
}
export default new HomePage()
