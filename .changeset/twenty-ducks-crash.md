---
'@scayle/storefront-application-nuxt': minor
---

**\[Promotions\]** Updated `SFPromotionProgressWrapper.vue` to support tiered promotions in addition to minimum-order-value promotions. It does so by treated minimum-order-value promotions as single-tier tiered promotions and using `usePromotionTierProgress` for both types. These promotions will display a progress bar showing the overall progress of the promotion as well as milestones indicating the various tier unlock points.
