---
'@scayle/storefront-boilerplate-nuxt': minor
---

[Architecture] As part of ongoing improvements to support the development and maintenance of tenant projects, all local application components (UI and subscription modules) now have the prefix `SF`. This standardized naming convention brings several benefits: improved code readability and maintainability across the codebase, and clear differentiation between Storefront Boilerplate components and custom components developed by tenants. This clear separation is crucial for the CLI, which will be responsible for managing and updating default components in tenant projects, preventing accidental overwrites and conflicts. See the example below for how this affects component imports.

- Example:

  ```ts
  // Before
  import Footer from '~/components/Footer.vue'

  // After
  import SFFooter from '~/components/SFFooter.vue'
  ```
