---
'@scayle/storefront-boilerplate-nuxt': patch
---

CMS: Fixed issues with fetching CMS data for categories and content pages due to changes in path slugs.
Category slugs are expected to now have the form `c/c-{categoryId}` (before `category/{categoryId}`),
while content pages are expected to have the form `content/{pageName}`(before `c/{pageName}`).
