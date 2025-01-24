---
'@scayle/storefront-boilerplate-nuxt': minor
---

[Architecture] Updated Nuxt configuration (`nuxt.config.ts`) to use the recommended `bundler` module resolution (removing `future.typescriptBundlerResolution: false`) introduced with Nuxt `v3.10`. This aligns with Vite/Vue best practices and improves compatibility.
While generally beneficial, some packages might experience issues. If so, raise an issue in the affected library's repository.

Temporarily reverting is possible by re-adding `future.typescriptBundlerResolution: false` to `nuxt.config.ts`.

For a more detailed explanation of bundler module resolution and its benefits, refer to the ([official Nuxt blog post](https://nuxt.com/blog/v3-10#bundler-module-resolution).

This change allows us to correctly import third-party packages with well-defined exports.

The following example shows test factories being able to be imported from `@scayle/storefront-nuxt`:

```ts
import {
  costFactory,
  basketItemsFactory,
} from '@scayle/storefront-nuxt/test/factories'
```
