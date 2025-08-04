---
'@scayle/storefront-application-nuxt': patch
---

**\[UI\]** Resolved an issue in the `SFBasketPopoverCard` component where the image sizes of some products were too small if the product name or brand name was too long. Additionally, the truncation of the name and brand name was not working as expected.

Handling the truncation of the name and brand name by setting `min-w-0` and `overflow-hidden` classes correctly solved both issues.
