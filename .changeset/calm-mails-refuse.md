---
'@scayle/storefront-application-nuxt': minor
---

**\[PLP\]** The range filter functionality has been enhanced to support filtering by both price and discount percentage.
To reflect this broader use case, `SFPriceRangeSlider.vue` and `SFPriceInput.vue` have been renamed to the more generic `SFFilterRangeSlider.vue` and `SFRangeInput.vue`.
This refactoring was done as part of adding support for discount filters (e.g., `max_savings_percentage`) in the filter slide-in.
