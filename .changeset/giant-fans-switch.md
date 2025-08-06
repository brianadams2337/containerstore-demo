---
'@scayle/storefront-application-nuxt': patch
---

**\[UI\]** Resolved a layout issue in the basket popover card (`SFBasketPopoverCard`) where long product or brand names would cause the product image to shrink and the text to overflow.
The text now truncates correctly, ensuring a consistent and clean layout, by setting `min-w-0` and `overflow-hidden` classes correctly solved both issues.
