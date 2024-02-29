import { defineConfig } from 'cypress'
/* START: Remove if relying on Cypress Dashboard */
import cypressOnFix from 'cypress-on-fix'
import cypressSplit from 'cypress-split'
/* END: Remove if relying on Cypress Dashboard */
import * as dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

const USER_AGENT =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'

const BASE_URL = process.env.BASE_URL ?? 'https://localhost:3000/de/' // Try to use local .env BASE_URL or fallback

const DefaultViewport = {
  WIDTH: 1440,
  HEIGHT: 900,
}

// https://docs.cypress.io/guides/references/configuration
export default defineConfig({
  pageLoadTimeout: 20000,
  defaultCommandTimeout: 20000,
  modifyObstructiveCode: false,
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'results',
    overwrite: false,
    html: false,
    json: true,
  },
  video: false,
  videosFolder: './videos',
  screenshotsFolder: './screenshots',
  screenshotOnRunFailure: true,
  fixturesFolder: './fixtures',
  downloadsFolder: './downloads',
  chromeWebSecurity: false,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  projectId: 'fzuayb',
  viewportWidth: DefaultViewport.WIDTH,
  viewportHeight: DefaultViewport.HEIGHT,
  // Cypress - Environment Variables
  // https://docs.cypress.io/guides/guides/environment-variables
  env: {
    lang: 'de-DE',
    shop_selector: 'path',
  },
  e2e: {
    setupNodeEvents(cypressOn, config) {
      /* START: Remove if relying on Cypress Dashboard */
      // Using `cypress-on-fix` fixing multiple Cypress plugins subscribing to "on" events
      // https://github.com/cypress-io/cypress/issues/22428
      // https://github.com/bahmutov/cypress-split?tab=readme-ov-file#debugging
      const on = cypressOnFix(cypressOn)

      // Split Cypress specs across parallel CI machines for speed without using any external services
      // https://github.com/bahmutov/cypress-split
      cypressSplit(on, config)
      /* END: Remove if relying on Cypress Dashboard */

      // Allow different cypress settings based on `MOBILE` env var
      return config.env.mobile
        ? {
            ...config,
            viewportWidth: 390,
            viewportHeight: 844,
            userAgent: USER_AGENT,
          }
        : {
            ...config,
            viewportWidth: DefaultViewport.WIDTH,
            viewportHeight: DefaultViewport.HEIGHT,
          }
    },
    // https://docs.cypress.io/guides/references/best-practices#Cypress-configuration-file
    baseUrl: BASE_URL, // Overridable in CI with CYPRESS_BASE_URL
    // https://docs.cypress.io/guides/references/experiments#End-to-End-Testing
    experimentalRunAllSpecs: true,
    // https://docs.cypress.io/guides/references/experiments#Experimental-Skip-Domain-Injection
    experimentalModifyObstructiveThirdPartyCode: true,
    includeShadowDom: true,
    supportFile: './support/e2e.ts',
    specPattern: 'e2e/**/*',
  },
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
    supportFile: './support/components.ts',
  },
})
