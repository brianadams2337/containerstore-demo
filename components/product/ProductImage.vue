<template>
  <NuxtPicture
    v-bind="{ alt, quality, sizes, modifiers, height, width }"
    densities="x1"
    :src="image.hash"
    :loading="imageLoading"
    :class="{
      'picture-contain': fit === 'contain',
      'picture-cover': fit === 'cover',
      'm-auto h-[90%]': isCentered,
      'aspect-4/3': aspectRatio === '4/3',
      'aspect-3/4': aspectRatio === '3/4',
      'aspect-video': aspectRatio === '16/9',
    }"
    provider="scayle"
    data-testid="product-image"
    class="picture block mix-blend-darken"
    @load="load"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ProductImage } from '@scayle/storefront-nuxt'

type Props = {
  image: ProductImage
  sizes?: string
  fit?: 'contain' | 'cover'
  alt?: string
  imageLoading?: 'lazy' | 'eager'
  quality?: number
  load?: () => void
  shouldTrim?: boolean
  isCentered?: boolean
  height?: number | string
  width?: number | string
  aspectRatio?: '16/9' | '4/3' | '3/4'
}

const props = withDefaults(defineProps<Props>(), {
  sizes: '',
  shouldTrim: false,
  isCentered: false,
  fit: 'contain',
  imageLoading: 'lazy',
  alt: undefined,
  quality: 75,
  height: undefined,
  width: undefined,
  aspectRatio: '3/4',
  load: () => {},
})

const modifiers = computed(() => ({ ...(props.shouldTrim && { trim: 1 }) }))
</script>

<style>
.picture img {
  height: 100%;
  width: 100%;
}

.picture-contain img {
  object-fit: contain;
}

.picture-cover img {
  object-fit: cover;
  object-position: center top;
}

.cursor-zoom-in {
  cursor: zoom-in;
}

.cursor-zoom-out {
  cursor: zoom-out;
}
</style>
