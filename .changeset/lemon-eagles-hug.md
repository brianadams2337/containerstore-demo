---
'@scayle/storefront-boilerplate-nuxt': patch
---

Fixed issues with Storyblok CMS setup by removing legacy runtime option (`public.storyblok` in `nuxt.config.ts`) and ensuring the necessary `accessToken` is not overriden during Storyblok module initialization.
