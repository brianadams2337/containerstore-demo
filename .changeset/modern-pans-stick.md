---
'@scayle/storefront-application-nuxt': minor
---

**\[Architecture\]** Updated the `svgoConfig` implementation to merge with the default settings rather than completely replacing them.
This prevents unintended side effects, such as icon alignment issues, caused by an incomplete configuration.
