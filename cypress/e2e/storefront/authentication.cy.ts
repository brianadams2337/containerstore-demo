// For the authentication test to run(and work) we need to have the https setup + fix the bug with the state change after login.
describe('authenticate feature', () => {
  describe('guest user', () => {
    it('should be able to login', () => {
      // Sign out before is required to destroy any possible session
      cy.visitAndWait('/signout')
      cy.clearSiteData()
      cy.visitAndWait('/signin')
      cy.signInWithEnvUser()

      cy.getBySelector('toast-info').should('exist')
      cy.getBySelector('user-popover').should('be.visible')
    })

    it('should be able to logout', () => {
      cy.visitAndWait('/')
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
