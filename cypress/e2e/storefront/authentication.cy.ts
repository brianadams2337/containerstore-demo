// For the authentication test to run(and work) we need to have the https setup + fix the bug with the state change after login.
describe('authenticate feature', () => {
  describe.skip('guest user', () => {
    it('should be able to login', () => {
      // Signout before is required to destroy any possible session
      cy.visitAndWait('/signout')
      cy.clearSiteData()
      cy.visitAndWait('/signin')
      cy.get('iframe')
        .iframe()
        .then((iframes: any[]) => {
          cy.wrap(iframes[0]).contains('Sign In')
          cy.wrap(iframes[0])
            .find('#email')
            .clear()
            .type(Cypress.env('CYPRESS_TEST_USERNAME'))
          cy.wrap(iframes[0])
            .find('#password')
            .type(Cypress.env('CYPRESS_TEST_PASSWORD'))
          cy.wrap(iframes[0])
            .find('button[data-test-id="login-submit"]')
            .click()
        })

      cy.getBySelector('successful-login').should('exist')

      // TODO unfortunately there's no change of state on this login link and the "Einloggen" link is still showing up. This has to be fixed first before this test can pass.
      // cy.getBySelector('header-login-link').should('not.be.visible')
      // cy.getBySelector('user-popover').should('be.visible')
    })

    it('should be able to logout', () => {
      cy.visitAndWait('/')
      // TODO login when the login process is fixed
      cy.getBySelector('user-popover').should('exist').trigger('hover')
    })
  })
  /**
   * Login existing user
   */
  describe('login user', () => {
    it('should be able to login', () => {
      cy.clearSiteData()
      cy.visit('/signin')
      cy.signInWithEnvUser()
      cy.url().should('eq', `${Cypress.config().baseUrl}/`)
      cy.getBySelector('toast-info').should('exist')
    })

    it('should be able to redirect after login', () => {
      const redirectUrl = '/account'
      cy.clearSiteData()
      cy.visitAndWait(redirectUrl)
      cy.url().should(
        'eq',
        `${Cypress.config().baseUrl}/signin?redirectUrl=${redirectUrl}`,
      )
      cy.signInWithEnvUser()
      cy.url().should('eq', `${Cypress.config().baseUrl}${redirectUrl}`)
      cy.getBySelector('toast-info').should('exist')
    })
  })
})
