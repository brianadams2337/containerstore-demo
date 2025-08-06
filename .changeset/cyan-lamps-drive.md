---
'@scayle/storefront-application-nuxt': patch
---

**\[PLP\]** Addressed an issue where resetting filters would incorrectly remove all URL query parameters, not just those related to filtering.
The fix ensures that only parameters prefixed with `filters` are removed, preserving the rest of the page state.
