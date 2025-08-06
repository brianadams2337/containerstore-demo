---
'@scayle/storefront-application-nuxt': patch
---

**\[UI\]** The `<SFPopover />` component has been updated to render its `content` slot only on the client side.
This change was necessary to fix a hydration mismatch caused by using transitions with the `appear` attribute that are not safe for server-side rendering.
