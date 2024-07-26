import { BasePage } from './basePage'
import Header from './components/header'

class HomePage extends BasePage {
  baseURL = '/'

  pageElements = {
    homePageContent: '[data-testid="home-page-content"]',
    highlightsProductSlider: '[data-test-id="horizontal-product-slider"]',
    countrySwitcher: '[data-test-id="language-listbox"]',
    languageOption: '[role="option"] button',
    promotionBanner: '[data-test-id="promotion-banner"]',
    promotionCountdown: '[data-test-id="promotion-countdown"]',
    showDealsButtonMobile: '[data-test-id="show-deals-button-mobile"]',
    showDealsButton: '[data-test-id="show-deals-button"]',
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

  assertPromotionBannerIsDisplayed() {
    cy.get(this.pageElements.promotionBanner).should('be.visible')
  }

  assertTimerBox() {
    cy.get(this.pageElements.promotionCountdown)
      .invoke('text')
      .should('match', /\d{2,3}[A-Z]:\d{2}[A-Z]:\d{2}[A-Z]/)
  }

  assertShowDealsButtonMobileIsDisplayed() {
    cy.get(this.pageElements.showDealsButtonMobile).should('be.visible')
  }

  assertShowDealsButtonIsDisplayed() {
    Cypress._.times(5, () => {
      cy.wait(5000)
      cy.get(this.pageElements.showDealsButton).should('be.visible')
    })
  }
}
export default new HomePage()
