<template>
  <SFItemsSlider
    ref="productImageSlider"
    class="size-full"
    :with-arrows="areArrowsShown"
    tabindex="-1"
    :slider-tabindex="-1"
  >
    <template #prev-button="{ prev, isPrevEnabled }">
      <SFProductCardImageSliderButton
        class="top-[40%] bg-white hover:bg-white"
        :disabled="!isPrevEnabled"
        direction="left"
        @click="prev()"
      />
    </template>
    <template #next-button="{ next, isNextEnabled }">
      <SFProductCardImageSliderButton
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
      tabindex="-1"
    >
      <SFProductImage
        v-if="item"
        :image="item"
        :alt="
          $t('product_image.alt_with_image_index', {
            alt,
            index: imageIndex + 1,
            total: images.length,
          })
        "
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
import { computed, useTemplateRef } from 'vue'
import SFProductImage from '../../SFProductImage.vue'
import SFProductCardImageSliderButton from './SFProductCardImageSliderButton.vue'
import { PRODUCT_CARD_IMAGE_EAGER_LOAD_SIZE } from '~/constants'
import { SFItemsSlider, SFLink } from '#storefront-ui/components'

const { isProductHovered, images, productIndex } = defineProps<{
  link: string
  isProductHovered: boolean
  alt: string
  images: ProductImageType[]
  productIndex: number
}>()

const slider = useTemplateRef('productImageSlider')
const scrollImageIntoView = (
  index: number,
  scrollBehavior: ScrollBehavior = 'auto',
) => {
  slider.value?.scrollImageIntoView(index, scrollBehavior)
}

defineExpose({
  scrollImageIntoView,
})

const areArrowsShown = computed(() => {
  if (import.meta.server) {
    return false
  }
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  return !isTouchDevice && isProductHovered && images.length > 1
})

const getImageLoading = (index: number) => {
  const shouldEagerLoad = productIndex < PRODUCT_CARD_IMAGE_EAGER_LOAD_SIZE
  return shouldEagerLoad && index === 0 ? 'eager' : 'lazy'
}

const shouldPreload = (index: number) => {
  const shouldPreload = productIndex < PRODUCT_CARD_IMAGE_EAGER_LOAD_SIZE
  return shouldPreload && index === 0
}
</script>
