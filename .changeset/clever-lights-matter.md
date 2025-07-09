---
'@scayle/storefront-application-nuxt': patch
---

**\[Accessibility\]** Addressed an issue where focus would incorrectly return to a `SFHeaderNavigationItem` after a `mouseleave` event and subsequent page navigation
The fix involves deactivating the focus trap without returning focus (`returnFocus: false`) when the interaction is mouse-driven, preventing the unwanted focus jump.
