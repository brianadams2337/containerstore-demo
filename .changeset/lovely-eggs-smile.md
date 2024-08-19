---
'@scayle/storefront-boilerplate-nuxt': patch
---

- Adapting E2E tests to use new test ID attributes due to the migration of existing data-test-id to data-testid. This enables Playwright to use built-in loactor getByTestId().
- Deleted existing PLP .spec.ts files and added all PLP tests to e2e-Plp-spec.ts, so this file now contains all current and future PLP tests. Having multiple tests within one .spec.ts file follows the logic of having multiple tests within one test suite related to respective application section.
- Added test to check add/remove to/from Wishlist from PLP page.
