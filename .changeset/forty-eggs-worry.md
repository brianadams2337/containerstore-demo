---
'@scayle/storefront-application-nuxt': minor
---

**\[Translations\]** To improve the reliability and maintainability of our translation files, we have refactored the codebase to use static translation keys where possible.
A new ESLint rule (`@intlify/vue-i18n/no-unused-keys`) has been enabled to flag unused keys as errors, ensuring our translation files remain clean and accurate.
A few dynamic keys are intentionally ignored where necessary for code readability.
