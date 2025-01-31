---
'@scayle/storefront-boilerplate-nuxt': minor
---

[Architecture] Updated Nuxt configuration (`nuxt.config.ts`) to utilize the recommended `bundler` module resolution introduced in Nuxt v3.10, removing the `future.typescriptBundlerResolution: false` flag. This aligns our project with Vite/Vue best practices and improves compatibility with third-party libraries.

While this change is generally beneficial, some packages might encounter issues. If you experience any problems, please report them in the affected library's repository. You can temporarily revert this change by adding `future.typescriptBundlerResolution: false` back to your `nuxt.config.ts` file.

This update allows for correct imports of third-party packages with well-defined exports, such as:

      ```ts
      import {
        costFactory,
        basketItemsFactory,
      } from '@scayle/storefront-nuxt/test/factories'
      ```

For further details on bundler module resolution and its advantages, refer to the [official Nuxt blog post](https://nuxt.com/blog/v3-10#bundler-module-resolution).
