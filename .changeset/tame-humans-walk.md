---
'@scayle/storefront-boilerplate-nuxt': patch
---

[Tracking] Removed the explicit `cart` event trigger when removing basket items using `useBasketActions`. This event is already handled automatically by the `useUserItemsTrackingWatcher`.
