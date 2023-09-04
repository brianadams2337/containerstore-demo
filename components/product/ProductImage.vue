<template>
  <NuxtPicture
    data-test-id="product-image"
    :quality="quality"
    :background="background"
    :src="image.hash"
    :modifiers="{ ...(shouldTrim && { trim: 1 }), brightness }"
    :sizes="sizes"
    provider="default"
    :loading="imageLoading"
    class="picture block mix-blend-darken"
    :class="{
      'picture-contain': fit === 'contain',
      'picture-cover': fit === 'cover',
      'm-auto h-[90%]': isCentered,
    }"
    @load="load" />
</template>

<script setup lang="ts">
import { ProductImage, getAttributeValue } from '@scayle/storefront-nuxt'

const props = defineProps({
  sizes: {
    type: String,
    required: false,
    default: '',
  },
  image: {
    type: Object as PropType<ProductImage>,
    required: true,
  },
  shouldTrim: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  fit: {
    type: String as PropType<String>,
    default: 'contain',
  },
  isCentered: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  alt: {
    type: String as PropType<String>,
    default: '',
  },
  quality: {
    type: Number as PropType<number>,
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

const brightness = computed(() => {
  const background = getAttributeValue(
    props.image.attributes,
    'imageBackground',
  )
  if (background === 'white') {
    return 0.96
  } else if (background === 'grey') {
    return 1.06
  }
  return 1
})
const background = computed(() => {
  const background = getAttributeValue(
    props.image.attributes,
    'imageBackground',
  )

  if (background === 'transparent') {
    return 'F4F4F4'
  } else {
    return 'FFFFFF'
  }
})
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
