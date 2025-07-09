---
'@scayle/storefront-application-nuxt': patch
---

**\[Architecture\]** To prevent hydration errors related to URL query parameters, Incremental Static Regeneration (ISR) has been disabled for all Vercel deployments.
This change is a necessary workaround for a known issue where query params were not correctly handled during server-side rendering with ISR.
More details are available in [this Nitro issue](https://github.com/nitrojs/nitro/issues/1880).
