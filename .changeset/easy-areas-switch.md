---
'@scayle/storefront-application-nuxt': minor
---

**\[E2E\]** Implemented 404 Error Page test. Added an end-to-end test within `e2e_Homepage.spec.ts` to verify the functionality of the "Page Not Found" (404) error page. Test opens the Homepage, navigates to non-existing route (`/non-existing-route`) and verifies that the proper error page is loaded. The page should contain the correct error code (404) and "Continue shopping" button.
