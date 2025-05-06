---
'@scayle/storefront-application-nuxt': minor
---

**\[Architecture\]** The Product Detail Page now uses a specific page key so that toggling between siblings and variants will not trigger a page reload. As part of this change, the page-specific middleware which corrects the product name in the URL was simplified and merged into the page.
