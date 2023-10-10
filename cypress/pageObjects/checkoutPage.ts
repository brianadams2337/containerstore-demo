import { BasePage } from './basePage'

class CheckoutPage extends BasePage {
  private pageElements = {
    auth: {
      loginOption: "[data-test-id='authOptions-signIn']",
      email: '#email',
      password: '#password',
      loginSubmitButton: "[data-test-id='login-submit']",
      registerOption: "[data-test-id='authOptions-register']",
      registerSubmitButton: "[data-test-id='register-submit']",
      firstName: "[data-test-id='register-firstName']",
      lastName: "[data-test-id='register-lastName']",
      iframeAuthenticationModal: "iframe[src^='/api/checkout/login']",
      checkoutContainer: '[id="ayCheckoutContainer"]',
    },
  }

  waitForPageToBeDisplayed(): void {
    cy.get('[data-test-id="login-submit"]', { timeout: 60000 })
  }

  signOut(): void {
    cy.visitAndWait('/signout')
  }

  register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): void {
    cy.get(this.pageElements.auth.registerOption).click({ force: true })
    cy.get(this.pageElements.auth.firstName).type(firstName, { force: true })
    cy.get(this.pageElements.auth.lastName).type(lastName, { force: true })
    cy.get(this.pageElements.auth.email).click().type(email, { force: true })
    cy.get(this.pageElements.auth.password).type(password, { force: true })

    cy.get('div').then((res) => {
      if (res.find(this.pageElements.auth.registerSubmitButton).length > 0) {
        cy.get(this.pageElements.auth.registerSubmitButton)
          .scrollIntoView()
          .click({ force: true })
      }
    })
  }

  login(email: string, password: string): void {
    cy.get(this.pageElements.auth.checkoutContainer)
    cy.get(this.pageElements.auth.loginSubmitButton)
    cy.get(this.pageElements.auth.email).click().type(email, { force: true })
    cy.get(this.pageElements.auth.password).type(password, { force: true })
    cy.get(this.pageElements.auth.loginSubmitButton).click()
  }
}

export default new CheckoutPage()
