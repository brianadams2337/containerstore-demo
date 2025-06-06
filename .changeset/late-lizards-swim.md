---
'@scayle/storefront-application-nuxt': patch
---

**\[E2E\]** To enhance test robustness, key end-to-end tests have been updated to reduce their dependency on specific content and product data.
SEO verification on the PDP, Wishlist, Login, and Basket pages now performs more generalized checks instead of asserting exact text.
Additionally, the Basket empty state test has been simplified to be independent of specific labels, ensuring greater stability.
