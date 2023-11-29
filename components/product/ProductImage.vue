<template>
  <NuxtPicture
    v-bind="{ alt, quality, background, sizes, modifiers, height }"
    :src="image.hash"
    :loading="imageLoading"
    :class="classes"
    provider="default"
    data-test-id="product-image"
    class="picture block mix-blend-darken"
    @load="load"
  />
</template>

<script setup lang="ts">
import { type ProductImage, getAttributeValue } from '@scayle/storefront-nuxt'

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
  load: () => {},
})

const imageBackground = computed(() => {
  return getAttributeValue(props.image.attributes, 'imageBackground')
})

const brightness = computed(() => {
  if (imageBackground.value === 'white') {
    return 0.96
  }
  if (imageBackground.value === 'grey') {
    return 1.06
  }
  return 1
})

const modifiers = computed(() => ({
  ...(props.shouldTrim && { trim: 1 }),
  brightness: brightness.value,
}))

const background = computed(() => {
  return imageBackground.value === 'transparent' ? 'f4f4f4' : 'ffffff'
})

const classes = computed(() => ({
  'picture-contain': props.fit === 'contain',
  'picture-cover': props.fit === 'cover',
  'm-auto h-[90%]': props.isCentered,
}))
</script>

<style>
.picture img {
  width: 100%;
  height: 100%;
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
