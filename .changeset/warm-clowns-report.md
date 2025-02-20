---
'@scayle/storefront-boilerplate-nuxt': minor
---

Extended the interface `PublicShopConfig` with the new property `countryCode`.

This property is necessary for distinguishing shops in different languages within the same country.
For example, Germany may have two shops: one in German (`de_DE`) and another in English (`en_US`).
Since the `locale` attribute only represents language and not the region, `countryCode` ensures correct regional detection.
