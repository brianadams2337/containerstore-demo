---
'@scayle/storefront-application-nuxt': minor
---

**\[Basket\]** Merged `SFBasketSummaryMobile.vue` and `SFBasketSummary.vue` into a single `SFBasketSummary.vue` component.
This eliminates duplicated code and DOM elements, and ensures that only one instance of `SFExpressCheckout.client.vue` is mounted.
This change addresses limitations of the `<scayle-express-checkout />` web component, which requires a single instance.
