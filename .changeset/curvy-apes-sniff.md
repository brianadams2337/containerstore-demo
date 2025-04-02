---
'@scayle/storefront-application-nuxt': patch
---

**\[E2E\]** Store locator end-to-end tests are now disabled for scheduled runs to optimize resource usage. To execute these tests, remove the `skip` suffix from the relevant test cases in `playwright/tests/e2e-StoreFinder.spec.ts` and test steps in `playwright/tests/e2e-Pdp.spec.ts`.
