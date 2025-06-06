---
'@scayle/storefront-application-nuxt': patch
---

**\[Architecture\]** Addressed a potential build failure related to a sub-dependency of the `@nuxtjs/tailwindcss` module.
The package `unicorn-magic` is now pinned to `v0.2.0` as a resolution, mitigating a potential fatal build error.
See https://github.com/nuxt-modules/tailwindcss/issues/954 for more details.
