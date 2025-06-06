---
'@scayle/storefront-application-nuxt': patch
---

**\[Architecture\]** Resolved an issue where navigating between categories on the Product Listing Page (PLP) was unresponsive.
This was caused by a reactivity problem after a recent change prevented the page from fully reloading.
The fix moves all category data fetching logic from the now-removed middleware directly into the PLP component, ensuring data updates correctly on navigation.
