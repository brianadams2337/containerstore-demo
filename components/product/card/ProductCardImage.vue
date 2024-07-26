<template>
  <SFLink :to="link" raw>
    <ProductImage
      :image="image"
      :alt="name"
      :class="{ 'opacity-20': !isAvailable }"
      fit="cover"
      :image-loading="imageLoading"
      sizes="sm:100vw"
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
  isAvailable: boolean
  image: ProductImage
  name: string
  productIndex: number
}>()

const imageLoading = computed(() => {
  return props.productIndex < PRODUCT_CARD_IMAGE_EAGER_LOAD_SIZE
    ? 'eager'
    : 'lazy'
})
</script>
