---
'@scayle/storefront-application-nuxt': patch
---

**\[ShopSwitcher\]** Resolved a routing issue where the `useShopSwitcher` composable would generate an incorrect base path when switching to the default shop in `path_or_default` mode.
It now correctly uses the `useLocalePath()` composable to ensure proper navigation.
