---
'@scayle/storefront-boilerplate-nuxt': minor
---

[Promotions] Refactored the handling of the bottom promotion banner height to improve performance and address several issues. Previously, the entire banner element was stored as a reference, leading to unnecessary layout re-renders and duplicated category API calls within the "Show deals" button triggered overlay due to `KeepAlive` issues. The implementation now uses a new `usePromotionBanner` composable to store only the banner's height. This simplifies gap calculations between the floating container and the banner, eliminates redundant re-renders, and resolves the API call duplication.
