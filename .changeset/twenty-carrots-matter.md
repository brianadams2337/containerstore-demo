---
'@scayle/storefront-boilerplate-nuxt': minor
---

[Architecture] To address the risks associated with using an unmaintained dependency and improve the long-term stability of our Google Tag Manager integration, we have replaced `@zadigetvoltaire/nuxt-gtm` with a locally maintained module, `@scayle/nuxt-gtm`. This new module incorporates the most recent version of `@gtm-support/vue-gtm`, benefiting from performance improvements, bug fixes, and ongoing maintenance. This migration also allows us to eliminate a custom patch previously required for compatibility, further simplifying our dependency management.
