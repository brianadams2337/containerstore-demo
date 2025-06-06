---
'@scayle/storefront-application-nuxt': minor
---

**\[Architecture\]** To simplify the codebase, the `useFilterSlideIn` composable has been removed.
Its logic was inlined, as the wrapper was an unnecessary layer of abstraction.
