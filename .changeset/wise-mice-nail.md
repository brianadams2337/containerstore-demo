---
'@scayle/storefront-application-nuxt': minor
---

[UI] Update `/components/product/promotion/gifts/SFProductPromotionGifts.vue` to store the visibility state of `<SFProductPromotionSelectionModal />` locally instead of using `useState`. This will prevent the modal from staying open during page navigation. Additionally, a single instance of `<SFProductPromotionSelectionModal />` will now be reused for all gift options, eliminating the need to create separate modals for each `<SFProductPromotionGiftItems />`.
