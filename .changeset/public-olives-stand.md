---
'@scayle/storefront-application-nuxt': patch
---

**\[SEO\]** Addressed an issue where hreflang links were missing for PLPs and PDPs during server-side rendering.
The data required to check product/category availability in other shops (`useAllShopCategoriesForId`, `useAllShopProductsForId`) was not yet available when the links were being generated.
The application now awaits these data-fetching functions, guaranteeing the availability data is present and allowing `hreflang` links to be generated reliably.
