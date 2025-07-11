---
'@scayle/storefront-application-nuxt': patch
---

**\[PLP\]** In the Product Listing page we now `await` the call to `useCategoryById` to ensure that the category-specific sort config is ready before calling `getProductsByCategory`.
