---
'@scayle/storefront-application-nuxt': patch
---

**\[Promotions\]** To improve code quality and maintainability, obsolete code related to inline gift selection has been removed.
This includes the isLastItemWithPromotions function in `SFBasketAvailableItems.vue` and the `show-free-gift-selection` prop in `SFBasketCard.vue`, both of which have been unused since Storefront Application `v1.9.0`.
