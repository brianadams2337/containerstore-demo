---
'@scayle/storefront-boilerplate-nuxt': patch
---

Add `maxRetriesPerRequest` to redis connection settings so that a broken connection does not cause unnecessary hanging.
