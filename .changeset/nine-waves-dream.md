---
'@scayle/storefront-boilerplate-nuxt': patch
---

### Adds new Promotion Badges on PLP, Wishlist and Basket page

New design of promotion badges on PLP, Wishlist, and Basket page.

- The Badge text comes from Storefront APIs `customData`, with `headlineParts` in bold and `badgeLabel` in regular font.
- Implements ellipsis for long `badgeLabel`.
- Due to space constraints, the basket page shows only `badgeLabel`; if it is missing, it will fallback to `headlineParts`.

```

```
