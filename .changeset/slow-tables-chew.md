---
'@scayle/storefront-boilerplate-nuxt': patch
---

[Accessibility] To prevent redundant focusable elements and improve keyboard navigation within the `SFPriceRangeSlider` component, the button element's focusability has been disabled. The slider's dots (provided by `VueSlider`) already provide proper focus handling, making the button's focus redundant and potentially confusing for keyboard users.
