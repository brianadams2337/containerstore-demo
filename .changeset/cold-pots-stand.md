---
'@scayle/storefront-boilerplate-nuxt': minor
---

**\[Order\]** The `Order` type is improved by introducing a new generic `Order<Product, Variant>`
type from `storefront-core`. Additionally, the order helpers are relocated into the boilerplate
and used within `usePurchaseEvents`. The `useOrder` generic is now correctly implemented,
ensuring correct order details types.
