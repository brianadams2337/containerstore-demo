---
'@scayle/storefront-application-nuxt': patch
---

**\[Architecture\]** Resolved hydration errors on initially set query params in the URL.

ISR for Vercel deployment is now disabled.
If set to true, the query params are not passed on server-side which leads to hydration errors.

See: https://github.com/nitrojs/nitro/issues/1880
