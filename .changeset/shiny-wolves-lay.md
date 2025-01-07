---
'@scayle/storefront-boilerplate-nuxt': minor
---

Add the `SF` prefix to all local application components, including UI and subscription module components.

The reasons for this change are as follows:

1. **Consistency Across the Codebase**: By prefixing components with `SF`, we ensure a uniform naming convention throughout our codebase, making it easier to understand and maintain.

2. **Clear Separation of Components**: The `SF` prefix helps distinguish components that are part of the Storefront Boilerplate from those custom-developed by tenants. This distinction is particularly crucial when building the CLI, which will copy new or overwrite existing "default" components in tenant projects.

Example:

```ts
// Before
import Footer from '~/components/Footer.vue'

// After
import SFFooter from '~/components/SFFooter.vue'
```
