---
'@scayle/storefront-application-nuxt': patch
---

**\[E2E\]** Improved the reliability of the mobile Order Success Page test.
The test was refactored to navigate from the PLP to the PDP by clicking the product image, and size selection now uses a forced click (`{force: true}`) to prevent CI-related timeouts.
