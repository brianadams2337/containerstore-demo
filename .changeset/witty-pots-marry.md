---
'@scayle/storefront-boilerplate-nuxt': minor
---

Replace the composable `useProductListFilter` with `useFiltersForListing` as it is renamed in `@scayle/storefront-product-listing` v0.6.0.
Also removed the return value `clearedPriceQuery`. Please use the utility function `getClearedFilterQueryByKey`.
