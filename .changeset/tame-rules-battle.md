---
'@scayle/storefront-boilerplate-nuxt': patch
---

Added a hook within `nuxt.config.ts` to extend the `vite` client build configuration and allow for improved manual chunking of `storyblok`, `contentful` and `axios` dependencies. This results in smaller client chunks below 500kb.
