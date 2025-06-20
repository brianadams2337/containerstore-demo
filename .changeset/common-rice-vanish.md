---
'@scayle/storefront-application-nuxt': minor
---

**\[UI\]** Improved aspect ratio configuration for `SFProductImage.vue`

The product image aspect ratio is now defined in a single source of truth: `config/ui.ts`.
There's no longer a need to apply additional styling on the parent element to achieve the desired aspect ratio.

This change enhances maintainability and makes it easier to adjust the aspect ratio in the future.

Before:

```vue
<div
  class="aspect-3/4"
> <!-- Before we had to apply aspect ratio on the parent element even though the image was already in the correct aspect ratio -->
    <SFProductImage
      :image="image"
      :image-loading="imageLoading"
      :alt="alt"
      :preload="preload"
      :aspect-ratio="[3, 4]"
      sizes="xs:50vw sm:50vw md:40vw lg:33vw xl:320px"
    />
  </div>
```

After:

```vue
<template>
  <div>
    <SFProductImage
      :image="image"
      :image-loading="imageLoading"
      :alt="alt"
      :preload="preload"
      :aspect-ratio="PRODUCT_IMAGE_ASPECT_RATIO" <!-- Setting the aspect ratio directly on the image is now sufficient. -->
      sizes="xs:50vw sm:50vw md:40vw lg:33vw xl:320px"
    />
  </div>
</template>

<script setup lang="ts">
import { PRODUCT_IMAGE_ASPECT_RATIO } from '~/config/ui' // Additionally we have a single configuration to configure the aspect ratio for all product images.
</script>
```
