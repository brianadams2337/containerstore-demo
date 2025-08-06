---
'@scayle/storefront-application-nuxt': minor
---

**\[Architecture\]** The Storefront Application has been upgraded to `nuxt@3.17.7`, which brings router enhancements and performance improvements.
While this Nuxt release has no breaking changes, the update revealed two pre-existing issues in our application that have now been resolved:
A duplicated `definePageMeta` on the Product Listing Page and a missing `inheritAttrs: false` on the `SFModal` component.
We had been inadvertently relying on a Nuxt bug which caused attributes to not be inherited through `ClientOnly`.
For more details on the Nuxt release, see the [official blog post](https://nuxt.com/blog/v3-17).
