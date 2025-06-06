---
'@scayle/storefront-application-nuxt': minor
---

**\[Promotions\]** Refactored how promotion conditions are checked within the `SFPromotionProgressWrapper` component.
The `areGiftConditionsMet` and `isGiftAddedToBasket` computed functions have been inlined directly into the component, removing their dependency on the `useProductPromotions` composable for this specific logic.
