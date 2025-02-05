---
'@scayle/storefront-boilerplate-nuxt': minor
---

[Architecture] We have improved the reactivity of our composables by passing getter
values directly and explicitly adding `toRef` conversions where necessary.
This ensures that reactivity is maintained throughout the application. For more details, refer to the [Vue.js documentation](https://vuejs.org/guide/components/props.html#passing-destructured-props-into-functions).

The affected composables are: `useSubscription`, `useProductBaseInfo`, `useRowIntersection`, `useProductPromotions`, `useProductPrice`, `usePagination` and `useBasketPromotionReductions`.
