---
'@scayle/storefront-application-nuxt': patch
---

**\[Accessibility\]** To prevent unintended filter updates in `SFPriceRangeSlider.vue`, the `@change` event handler has been removed from the price input field.
This stops a filter action from being triggered simply by blurring the input.
