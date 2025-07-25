---
'@scayle/storefront-application-nuxt': patch
---

**\[PLP\]** Fixed an issue where resetting all filters would remove unrelated query parameters. Now, only query parameters starting with `filters` are removed when resetting filters.
