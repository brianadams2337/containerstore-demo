---
'@scayle/storefront-boilerplate-nuxt': patch
---

Utility Replacement: Replaced `radash.isEqual` with custom `isEqual` util

NOTE: Arbitrary comparison of objects can have a exponentially negative impact
on performance the larger the compared objects are. We recommend to compare the
values of explicit keys between two objects.
