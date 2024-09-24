<template>
  <SFLink :to="link" raw>
    <ProductImage
      :image="image"
      :image-loading="imageLoading"
      :alt="alt"
      sizes="xs:50vw sm:50vw md:40vw lg:33vw xl:320px"
      class="absolute inset-0"
    />
  </SFLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ProductImage } from '@scayle/storefront-nuxt'
import { PRODUCT_CARD_IMAGE_EAGER_LOAD_SIZE } from '~/constants'

const props = defineProps<{
  link: string
  image: ProductImage
  alt: string
  productIndex: number
}>()

const imageLoading = computed(() => {
  return props.productIndex < PRODUCT_CARD_IMAGE_EAGER_LOAD_SIZE
    ? 'eager'
    : 'lazy'
})
</script>
