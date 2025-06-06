---
'@scayle/storefront-application-nuxt': patch
---

**\[E2E\]** Improved the robustness of product variant selection in end-to-end tests.
A new method, `chooseProductVariant()`, now intelligently checks if the variant picker is disabled (for single-variant products) or enabled (for multi-variant products), ensuring tests can reliably handle different product types.
