---
'@scayle/storefront-boilerplate-nuxt': minor
---

Introduced usage of explicit imports for composables, utilities and framework-specific functionalities and disabled `imports.autoImport` within the `nuxt.config.ts`.
NOTE: As `defineProps`, `defineEmits` and `withDefaults` are Vue compiler macros, they do not need to be imported explicitly
and will trigger a compiler warning if done so.
