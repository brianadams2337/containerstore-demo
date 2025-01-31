---
'@scayle/storefront-boilerplate-nuxt': minor
---

[PDP] To prevent potentially misleading price displays on product detail pages (`/pages/p/[...productName]-[id].vue`), subscription items in the basket are now ignored when determining the price to display for the corresponding regular product. Previously, the presence of subscription items with potential extra discounts could lead to inaccurate price displays for regular items. This change ensures that the displayed price accurately reflects the price of the regular product itself.
