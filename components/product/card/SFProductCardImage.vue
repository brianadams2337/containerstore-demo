<template>
  <SFLocalizedLink :to="link" raw tabindex="-1">
    <SFProductImage
      :image="image"
      :image-loading="imageLoading"
      :alt="alt"
      :preload="preload"
      sizes="xs:50vw sm:50vw md:40vw lg:33vw xl:320px"
      class="absolute inset-0"
    />
  </SFLocalizedLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ProductImage as ProductImageType } from '@scayle/storefront-nuxt'
import SFProductImage from '../SFProductImage.vue'
import { PRODUCT_CARD_IMAGE_EAGER_LOAD_SIZE } from '~/constants'
import SFLocalizedLink from '~/components/SFLocalizedLink.vue'

const props = defineProps<{
  link: string
  image: ProductImageType
  alt: string
  productIndex: number
}>()

const imageLoading = computed(() => {
  return props.productIndex < PRODUCT_CARD_IMAGE_EAGER_LOAD_SIZE
    ? 'eager'
    : 'lazy'
})

const preload = computed(
  () => props.productIndex < PRODUCT_CARD_IMAGE_EAGER_LOAD_SIZE,
)
</script>
