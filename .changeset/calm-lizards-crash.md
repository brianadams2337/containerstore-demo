---
'@scayle/storefront-application-nuxt': minor
---

**\[PLP\]** To improve performance and create a single source of truth, the product listing logic has been refactored as part of the upgrade to `@scayle/storefront-product-listing@2.0.0`.

- **Sorting Logic:** The `useProductListSort` composable is now centralized at the page level to act as a single source of truth.
- **SEO Data:** The `useProductListingSeoData` composable now requires an additional isDefaultSortSelected boolean parameter.
- **UI Labels:** The `label` for the selected sort option is now a direct string and should no longer be passed through the translation function (`$t(label)`).
