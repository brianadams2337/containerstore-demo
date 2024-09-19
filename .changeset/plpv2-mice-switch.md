---
'@scayle/storefront-boilerplate-nuxt': minor
---

PLP: Improve responsiveness of switching categories on the product listing page

The following changes were made to optimize the navigation that occurs on a category switch:

- Skipping unnecessary middlewares on the navigation
- Not unnecessarily reloading root categories on category switch
- Removing unnecessary awaits within `setup` functions
- Passing `categoryId` to `useProducts` directly to avoid additional fetches
