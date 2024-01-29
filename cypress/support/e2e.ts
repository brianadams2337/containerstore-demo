import 'cypress-real-events/support'
import './commands'

/**
 * Add Vercel Protection Bypass Header
 *
 * NOTE: This can be removed if Vercel is not used for deployment and testing!
 *
 * https://docs.cypress.io/api/commands/intercept#Controlling-the-outbound-request-with-reqcontinue
 * https://webtips.dev/webtips/cypress/add-headers-to-every-request-in-cypress
 */

beforeEach(() => {
  cy.intercept(`${Cypress.config('baseUrl')}**`, (req) => {
    req.headers['x-vercel-protection-bypass'] = Cypress.env(
      'VERCEL_AUTOMATION_BYPASS_SECRET',
    )
    req.headers['x-vercel-set-bypass-cookie'] = 'true'

    // send the modified request and skip any other
    // matching request handlers
    req.continue()
  })
})
