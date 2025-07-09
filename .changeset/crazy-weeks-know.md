---
'@scayle/storefront-application-nuxt': minor
---

**\[Architecture\]** Addressed an issue where `$config.public.baseUrl` provided an incorrect base URL for domain-based shops.
This deprecated property has been removed, and we now use `useRequestURL().origin` to reliably get the correct base URL.
