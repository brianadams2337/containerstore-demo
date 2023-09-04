<template>
  <NuxtPicture
    v-bind="{ alt, quality, background, sizes, modifiers }"
    :src="image.hash"
    :loading="imageLoading"
    :class="classes"
    provider="default"
    data-test-id="product-image"
    class="picture block mix-blend-darken"
    @load="load" />
</template>

<script setup lang="ts">
import { ProductImage, getAttributeValue } from '@scayle/storefront-nuxt'

const props = defineProps({
  sizes: {
    type: String,
    default: '',
  },
  image: {
    type: Object as PropType<ProductImage>,
    required: true,
  },
  shouldTrim: {
    type: Boolean,
    default: false,
  },
  fit: {
    type: String,
    default: 'contain',
  },
  isCentered: {
    type: Boolean,
    default: false,
  },
  alt: {
    type: String,
    default: undefined,
  },
  quality: {
    type: Number,
    default: 75,
  },
  load: {
    type: Function as PropType<() => void>,
    default: () => {},
  },
  imageLoading: {
    type: String as PropType<'lazy' | 'eager'>,
    default: 'lazy',
  },
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
