import { defineConfig } from "cypress";
import { url, cleanEnv } from "envalid";
import * as dotenv from "dotenv";

dotenv.config();

const { BASE_URL } = cleanEnv(process.env, { BASE_URL: url() });

const USER_AGENT =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1";

module.exports = defineConfig({
  pageLoadTimeout: 20000,
  defaultCommandTimeout: 20000,
  modifyObstructiveCode: false,
  video: false,
  videosFolder: "./cypress/videos",
  screenshotsFolder: "./cypress/screenshots",
  chromeWebSecurity: false,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  projectId: "fzuayb",
  viewportWidth: 1440,
  viewportHeight: 900,
  env: {
    lang: "en-EN",
  },
  e2e: {
    setupNodeEvents(_on, config) {
      if (config.env.mobile === true) {
        return {
          viewportWidth: 390,
          viewportHeight: 844,
          userAgent: USER_AGENT,
        };
      }
      return {
        viewportWidth: 1440,
        viewportHeight: 900,
      };
    },
    baseUrl: `${BASE_URL}/en`,
    experimentalRunAllSpecs: true,
    experimentalModifyObstructiveThirdPartyCode: true,
    includeShadowDom: true,
  },
  component: {
    devServer: {
      framework: "nuxt",
      bundler: "vite",
    },
  },
});
