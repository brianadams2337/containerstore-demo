---
'@scayle/storefront-boilerplate-nuxt': patch
---

Added additional Typescript linting rules to be used in End-to-End tests to Playwright `eslint.config.mjs`. The first one is `no-floating-promises` and it forces `await` in a call that returns a promise. The second one is `await-thenable`. It raises an error if `await` is used when the promise is not returned.
