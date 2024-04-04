---
'@scayle/storefront-boilerplate-nuxt': minor
---

### Disable caching for Vercel Deployments

Vercel's CDN Caching works slightly differently from the default Nuxt Page caching, which is currently incompatible with our Session handling.

To disable all caching for Vercel Deployments, remove any `routeRules` you have configured in your `nuxt.config.ts`.
