---
'@scayle/storefront-application-nuxt': patch
---

**\[Accessibility\]** Corrected the ARIA implementation in `SFProductPromotionBanner.vue`.
The `aria-label` is now conditionally applied only when the component is rendered as a link, ensuring proper accessibility without affecting non-interactive instances.
