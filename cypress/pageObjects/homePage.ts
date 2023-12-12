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
    cy.request('builds/meta/dev.json')
    cy.get('[data-test-id="close-promotion-button"]').click()
  }
}
export default new HomePage()
