---
'@scayle/storefront-application-nuxt': patch
---

**\[PDP\]** Fixed issue where controls of the `<SFProductGallery />` were not usable after the `<SFProductGalleryZoom />` was opened. Adding `z-index: 10` ensures the controls can always be clicked.
