// For the authentication test to run(and work) we need to have the https setup + fix the bug with the state change after login.
import SignInPage from '../../pageObjects/signInPage'

describe('authenticate feature', () => {
  describe('guest user', () => {
    it('should be able to login', () => {
      // Sign out before is required to destroy any possible session
      cy.visitAndWait('/signin')
      SignInPage.login()

      cy.getBySelector('toast-info').should('exist')
      cy.getBySelector('user-popover').should('be.visible')
    })

    it('should be able to logout', () => {
      cy.visitAndWait('/')
      cy.getBySelector('user-popover').should('exist').trigger('hover')
    })
  })
})
