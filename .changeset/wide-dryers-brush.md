---
'@scayle/storefront-application-nuxt': patch
---

**\[E2E\]** To further improve the stability of end-to-end tests that navigate to the Product Listing Page, an additional wait condition has been added.
Tests will now explicitly wait for the PLP breadcrumb element to be visible, preventing failures caused by race conditions or slow page loads.
