---
'@scayle/storefront-application-nuxt': patch
---

**\[UI\]** Addressed a positioning bug where the flyout in `SFHeaderNavigationItem` would appear in the wrong place.
The issue, caused by dynamic `translateX` positioning, has been resolved by anchoring the flyout's position relative to the main header.
