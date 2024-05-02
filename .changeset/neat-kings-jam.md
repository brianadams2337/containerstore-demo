---
'@scayle/storefront-boilerplate-nuxt': major
---

Introduce `storefront-ui` local module.

The module will contain every UI common component across the app (most of them were under the `./components/ui` folder).
It will also have composables and utils that are closly related to the migrated components.

Moreover, all of these components are now prefixed with `SF` when using the component in template (prefix can be configurable via `nuxt.config`).
