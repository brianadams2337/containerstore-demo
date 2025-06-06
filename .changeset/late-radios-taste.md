---
'@scayle/storefront-application-nuxt': minor
---

**\[Architecture\]** The Product Detail Page's architecture has been enhanced by assigning it a static page key, which prevents full page reloads when toggling between variants and siblings.
This change also allowed us to simplify the codebase by removing a page-specific middleware and merging its URL correction logic directly into the PDP component.
