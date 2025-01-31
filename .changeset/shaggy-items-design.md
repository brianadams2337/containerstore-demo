---
'@scayle/storefront-boilerplate-nuxt': patch
---

[E2E] Enhanced the reliability and stability of end-to-end (E2E) tests, particularly those involving user accounts. Each browser now uses a dedicated user account during test execution, preventing data conflicts and ensuring more consistent test results. Additionally, test timeout thresholds have been increased to accommodate potential temporary slowdowns and reduce the occurrence of false positives.
To configure dedicated test user accounts for each browser, set the following environment variables (refer to `env.example` for reference):

- `TEST_USER_EMAIL`
- `TEST_USER_EMAIL2`
- `TEST_USER_EMAIL3`
- `TEST_USER_EMAIL4`
- `TEST_USER_EMAIL5`
- `TEST_USER_PASSWORD`
- `TEST_USER_WRONG_PASSWORD`
- `TEST_USER_NO_ORDERS_PASSWORD`

These variables can be set in a `.env` file or via CI/CD variables. The mapping between browsers and user accounts is defined in the getUserForBrowser function in `playwright/support/utils`.
