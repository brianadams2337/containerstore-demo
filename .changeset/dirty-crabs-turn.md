---
'@scayle/storefront-application-nuxt': patch
---

**\[E2E\]** Enhanced Mobile Order Success Page test reliability. Refactored the end-to-end test to navigate to the PDP via product image click on the PLP. Implemented `{force: true}` for size selection on the PDP to mitigate potential timeout issues during CI execution that occurred with standard `.click()`.
