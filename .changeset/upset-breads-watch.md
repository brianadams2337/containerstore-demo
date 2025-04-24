---
'@scayle/storefront-application-nuxt': patch
---

**\[Accessibility\]** Added scroll margin to all focusable elements within the `SFSlideIn.client.vue` component to prevent them from being obscured by the sticky action bar when focused. This resolves an issue where keyboard navigation could bring elements behind the footer.
