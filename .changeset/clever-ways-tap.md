---
'@scayle/storefront-boilerplate-nuxt': minor
---

[Performance] Addressed a hydration mismatch issue in the wishlist page (`/pages/wishlist.vue`) that was impacting performance. The count badge update is now delayed until hydration is complete, and the content is wrapped within an `<SFAsyncDataWrapper>` to ensure proper server/client synchronization. This prevents content flickering and improves the overall loading experience.
