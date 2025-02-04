---
'@scayle/storefront-boilerplate-nuxt': patch
---

[E2E] Improved hydration error testing by differentiating between guest and logged-in user scenarios. Guest user tests now verify empty states for pages like Wishlist and Basket, while logged-in user tests validate pre-populated states. The list of pages checked for hydration issues has been expanded by adding additional URLs in `/playwright/support/pages-hydration-check.json`. Enhanced failure messages now include specific arguments for improved debugging context.
