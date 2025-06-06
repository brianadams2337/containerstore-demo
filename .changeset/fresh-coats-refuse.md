---
'@scayle/storefront-application-nuxt': patch
---

**\[Basket\]** Corrected the state handling for promotional gifts to enable the addition of multiple gift products.
Previously, the `variantId` of the initial gift was not being cleared, which blocked subsequent gift additions.
