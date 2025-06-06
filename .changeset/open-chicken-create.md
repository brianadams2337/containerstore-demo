---
'@scayle/storefront-application-nuxt': patch
---

**\[E2E\]** The end-to-end test for the Basket's empty state (`e2e-Basket.spec.ts`) has been made more stable.
A new step now automatically clears any pre-existing items from the logged-in user's basket, ensuring the test is reliable and independent of prior user activity.
