---
'@scayle/storefront-application-nuxt': patch
---

**\[Accessibility\]** Addressed an issue where Chrome's handling of `scroll-margin` caused inconsistent scroll behavior in the `SFSlideIn.client.vue` component.
The implementation has been switched to use `scroll-padding` for more reliable cross-browser results.
