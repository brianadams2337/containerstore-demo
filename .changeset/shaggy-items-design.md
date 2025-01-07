---
'@scayle/storefront-boilerplate-nuxt': patch
---

E2E: Each browser now utilizes a dedicated user account during execution of User Account related end-to-end tests. This eliminates potential conflicts and inconsistencies arising from shared test data. The timeout threshold for test steps has been increased. This allows enough time for processes to complete, reducing false positives due to temporary slowdowns. Environment variables names are set as a reference with empty values in the `playwright/.env.example` file under the `### PLAYWRIGHT E2E TESTS ###` section. They can be used in `playwright/.env` file or in the CI execution (e.g. Gitlab CI/CD Variables) by setting the exact variable name and respective values. Connection between environment variables for dedicated test users and browsers is defined in `playwright/support/utils` within `getUserForBrowser(browserName: string)` function.
