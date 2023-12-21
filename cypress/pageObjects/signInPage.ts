import { LOGGED_IN_USER_DATA } from '../support/constants'
import { BasePage } from './basePage'
import Header from './components/header'
import HomePage from './homePage'

class SignInPage extends BasePage {
  private pageElements = {
    email: 'input[type="email"]',
    password: 'input[type="password"]',
    loginSubmitButton: 'button[class*="p-3 border border-primary"]',
  }

  getLoginIFrameBody() {
    return cy
      .get('iframe')
      .its('0.contentDocument.body')
      .should('not.be.empty')
      .then(cy.wrap)
  }

  waitForPageToBeDisplayed(): void {
    Header.assertHeaderIsDisplayed()
    cy.get(this.pageElements.email).should('be.visible')
    cy.get(this.pageElements.password).should('be.visible')
  }

  fillLoginData(email: string, password: string) {
    cy.get(this.pageElements.email).type(email)
    cy.get(this.pageElements.password).type(password)
  }

  clickSubmitButton() {
    cy.get(this.pageElements.loginSubmitButton).click()
  }

  login(
    email = LOGGED_IN_USER_DATA.email,
    password = LOGGED_IN_USER_DATA.password,
  ) {
    this.waitForPageToBeDisplayed()
    this.fillLoginData(email, password)
    this.clickSubmitButton()
    HomePage.waitForPageToBeDisplayed()
  }
}
export default new SignInPage()
