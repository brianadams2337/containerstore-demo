---
'@scayle/storefront-application-nuxt': minor
---

**\[Performance\]** Updated `routeRules` in `nuxt.config.ts` to disable internal Redis page caching and rely solely on `Cache-Control` headers which can be handled efficiently by external CDNs like Cloudflare.

```ts
// Before
const CACHE_PAGE: NitroRouteConfig = isVercel
  ? {
      isr: false,
      cache: {
        maxAge: 10 * 60, // Default: 10min
        staleMaxAge: 10 * 60, // Default: 10min
        headersOnly: true,
      },
    }
  : {
      cache: {
        // SWR currently leads to some bugs in the Nitro caching implementation that it will continue to serve outdated data in case the SSR handler crashes
        // We recommend to keep this disabled currently.
        swr: false, // Disable stale-while-revalidate
        maxAge: 10 * 60, // Default: 10min
        staleMaxAge: 10 * 60, // Default: 10min
        group: 'ssr', // Cache group name
        name: 'page', // Set prefix name

        // Consider the host for the cache key which is required when using domain based shops
        varies: ['host', 'x-forwarded-host'],

        // Add the version as an integrity so we clear our cache when a new version gets deployed.
        // If no specific version is supplied, we will generate a unique ID during the build process.
        integrity: process.env.VERSION ?? nanoid(8),

        // Use storefront storage mount
        // Depending on your configuration this might be `redis` or another database driver
        // https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/introduction#storage
        base: 'storefront-cache',
      },
    }
```

```ts
// After
const CACHE_PAGE: NitroRouteConfig = {
  isr: false,
  cache: {
    maxAge: 10 * 60, // Default: 10min
    swr: false,
    headersOnly: true,
  },
}
```
