---
'@scayle/storefront-boilerplate-nuxt': minor
---

[Promotions] Store the height of the bottom banner using a new `usePromotionBanner`
composable instead of storing the entire element as a reference. The reasoning behind
this change is to facilitate the gap calculation between the floating
container and the bottom promotion banner. The previous implementation required
re-rendering the bottom promotions layout to reset the bottom promotion banner
as a dynamic reference, which also recalculated the height. This approach was suboptimal
for several reasons, including unnecessary layout re-rendering for each promotion
change and duplicated category API calls within the "Show deals" button due
to `KeepAlive` not functioning properly.
