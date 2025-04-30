---
'@scayle/storefront-application-nuxt': patch
---

**\[UI\]** Resolved a rendering issue with the empty state icon on the wishlist page. The root cause was conflicting SVG ID attributes, which have now been made unique to prevent DOM collisions.
