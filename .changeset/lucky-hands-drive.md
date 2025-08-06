---
'@scayle/storefront-application-nuxt': patch
---

**\[PLP\]** Resolved a race condition where products could be loaded before their category-specific sorting configuration was applied.
The application now correctly awaits the category data (`useCategoryById`) before fetching the product list (`getProductsByCategory`) to ensure the proper sort order is always used.
