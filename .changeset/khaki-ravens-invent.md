---
'@scayle/storefront-boilerplate-nuxt': minor
---

We've refactored the `redirectTrailingSlash.global.ts` middleware to use a `slice()`-based approach instead of a RegEx-based approach for normalizing the URL path and added some test cases to verify its intended functionality, including some performance comparision tests with the former implementation.
