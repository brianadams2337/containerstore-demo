---
'@scayle/storefront-application-nuxt': minor
---

**\[Promotions\]** Corrected an issue where promotion badges for free gifts in the basket (`SFBasketCardImage.vue`) used custom frontend logic.
The implementation has been changed to remove this custom label and derive the badge from the basket item's data, ensuring it reflects the actual promotion configuration.
