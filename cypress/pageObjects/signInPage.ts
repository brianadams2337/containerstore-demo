import { BasePage } from './basePage'
import Header from './components/header'

class SignInPage extends BasePage {
  private pageElements = {
    email: '#email',
    password: '#password',
    loginSubmitButton: "[data-test-id='login-submit']",
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
    cy.wait(5000)
    this.getLoginIFrameBody().find(this.pageElements.email).should('exist')
    this.getLoginIFrameBody().find(this.pageElements.password).should('exist')
    this.getLoginIFrameBody()
      .find(this.pageElements.loginSubmitButton)
      .should('exist')
  }

  fillLoginData(email: string, password: string) {
    this.getLoginIFrameBody()
      .find(this.pageElements.email)
      .should('exist')
      .type(email)
    this.getLoginIFrameBody()
      .find(this.pageElements.password)
      .should('exist')
      .type(password)
  }

  clickSubmitButton() {
    this.getLoginIFrameBody()
      .find(this.pageElements.loginSubmitButton)
      .should('exist')
      .click()
  }
}
export default new SignInPage()
