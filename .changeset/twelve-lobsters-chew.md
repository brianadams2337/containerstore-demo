---
'@scayle/storefront-boilerplate-nuxt': patch
---

Added a check for the existence of the `country_selection.override_codes.<...>` translation key before resolving its translation.
This prevents console warnings that were previously triggered when attempting to resolve nonexistent translation keys.
