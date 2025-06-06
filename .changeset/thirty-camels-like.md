---
'@scayle/storefront-application-nuxt': patch
---

**\[E2E\]** To speed up test execution in non-Vercel environments, Vercel-specific HTTP headers are now applied conditionally.
This is controlled by the `isTargetingVercel` environment variable in the Playwright configuration, preventing unnecessary overhead.
