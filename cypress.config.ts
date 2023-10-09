import { defineConfig } from 'cypress'
import { url, cleanEnv, email, str } from 'envalid'
import * as dotenv from 'dotenv'

dotenv.config()

const { BASE_URL, CYPRESS_TEST_USERNAME, CYPRESS_TEST_PASSWORD } = cleanEnv(
  process.env,
  {
    BASE_URL: url(),
    CYPRESS_TEST_USERNAME: email(),
    CYPRESS_TEST_PASSWORD: str(),
  },
)

const USER_AGENT =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'

const DefaultViewport = {
  WIDTH: 1440,
  HEIGHT: 900,
}

export default defineConfig({
  pageLoadTimeout: 20000,
  defaultCommandTimeout: 20000,
  modifyObstructiveCode: false,
  video: false,
  videosFolder: './cypress/videos',
  screenshotsFolder: './cypress/screenshots',
  chromeWebSecurity: false,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  projectId: 'fzuayb',
  viewportWidth: DefaultViewport.WIDTH,
  viewportHeight: DefaultViewport.HEIGHT,
  env: {
    lang: 'en-EN',
    username: CYPRESS_TEST_USERNAME,
    password: CYPRESS_TEST_PASSWORD,
  },
  e2e: {
    setupNodeEvents(_on, config) {
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
    baseUrl: `${BASE_URL}`,
    experimentalRunAllSpecs: true,
    experimentalModifyObstructiveThirdPartyCode: true,
    includeShadowDom: true,
  },
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },
})
