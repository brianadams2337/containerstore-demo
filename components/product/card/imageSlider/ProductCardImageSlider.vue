<template>
  <SFItemsSlider class="size-full" :with-arrows="areArrowsShown">
    <template #prev-button="{ prev, isPrevEnabled }">
      <ProductCardImageSliderButton
        class="top-[40%] bg-white hover:bg-white"
        :disabled="!isPrevEnabled"
        direction="left"
        @click="prev()"
      />
    </template>
    <template #next-button="{ next, isNextEnabled }">
      <ProductCardImageSliderButton
        class="top-[40%] bg-white hover:bg-white"
        :disabled="!isNextEnabled"
        direction="right"
        @click="next()"
      />
    </template>
    <SFLink
      v-for="(item, imageIndex) in images"
      :key="item.hash"
      :to="link"
      raw
      class="relative min-w-full snap-start snap-always"
    >
      <ProductImage
        v-if="item"
        :image="item"
        :alt="alt"
        :image-loading="getImageLoading(imageIndex)"
        :preload="shouldPreload(imageIndex)"
        sizes="xs:50vw sm:50vw md:40vw lg:33vw xl:320px"
        class="absolute inset-0"
      />
    </SFLink>
  </SFItemsSlider>
</template>

<script setup lang="ts">
import type { ProductImage as ProductImageType } from '@scayle/storefront-nuxt'
import { computed } from 'vue'
import ProductImage from '../../ProductImage.vue'
import ProductCardImageSliderButton from './ProductCardImageSliderButton.vue'
import { PRODUCT_CARD_IMAGE_EAGER_LOAD_SIZE } from '~/constants'
import { SFItemsSlider, SFLink } from '#storefront-ui/components'

type Props = {
  link: string
  isProductHovered: boolean
  alt: string
  images: ProductImageType[]
  productIndex: number
}

const props = defineProps<Props>()

const areArrowsShown = computed(() => {
  if (import.meta.server) {
    return false
  }
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  return !isTouchDevice && props.isProductHovered && props.images.length > 1
})

const getImageLoading = (index: number) => {
  const shouldEagerLoad =
    props.productIndex < PRODUCT_CARD_IMAGE_EAGER_LOAD_SIZE
  return shouldEagerLoad && index === 0 ? 'eager' : 'lazy'
}

const shouldPreload = (index: number) => {
  const shouldPreload = props.productIndex < PRODUCT_CARD_IMAGE_EAGER_LOAD_SIZE
  return shouldPreload && index === 0
}
</script>
