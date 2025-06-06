---
'@scayle/storefront-application-nuxt': patch
---

**\[E2E\]** The end-to-end test suite has been enhanced to be more robust and adaptable across different environments.
We have reduced dependencies on hardcoded product IDs and static URLs, leading to more reliable test runs.

- `e2e-Account.spec.ts`: Tests now navigate to the User Profile via the Homepage, eliminating the use of hardcoded profile URLs.
- `e2e-Footer.spec.ts`: Footer link verification has been consolidated into `e2e-Homepage.spec.ts`, and the dedicated Footer links test has been streamlined.
- `e2e-Orders.spec.ts`: Introduced an environment variable to provision test users with no prior orders.
- `e2e-OrderSuccessPage.spec.ts`: Exact page title and description are no longer the part of SEO checks.
- `e2e-Pdp.spec.ts`: Product information (name, brand, price) and Wishlist interactions are now generalized, removing the need for specific Product ID.
- `e2e-Wishlist.spec.ts`: Verification of Wishlist contents and SEO elements is now independent of specific Product ID.
