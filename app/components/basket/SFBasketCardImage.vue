<template>
  <div
    class="relative flex w-full grow items-center justify-center overflow-hidden rounded-lg bg-gray-100"
    :class="isSmallSize ? 'max-w-28' : 'max-w-36'"
  >
    <SFLocalizedLink v-if="link" class="w-full" :to="link" raw tabindex="-1">
      <SFProductImage
        v-if="image"
        :image="image"
        :alt="alt"
        :sizes="isSmallSize ? '112px' : '144px'"
        class="overflow-hidden rounded-lg"
        :class="[{ 'opacity-60': isSoldOut }]"
      />
      <SFPromotionBadge
        v-if="basketItem.promotion && basketItem.promotion.isValid"
        :text="text"
        :style="style"
        class="absolute bottom-2.5 ml-1"
      />
    </SFLocalizedLink>
    <div
      v-if="!hideWishlistToggle"
      class="absolute left-auto right-1 top-2 z-10 flex h-8 w-auto cursor-pointer p-1 transition lg:right-0 lg:top-0 lg:h-12 lg:p-3"
    >
      <SFWishlistToggle :product="basketItem.product" @click.stop />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { BasketItem } from '@scayle/storefront-nuxt'
import SFPromotionBadge from '../promotion/SFPromotionBadge.vue'
import SFLocalizedLink from '~/components/SFLocalizedLink.vue'
import SFProductImage from '~/components/product/SFProductImage.vue'
import SFWishlistToggle from '~/components/product/SFWishlistToggle.vue'
import { useProductBaseInfo } from '~/composables'
import { getPromotionStyle } from '~/utils'

const {
  basketItem,
  isSoldOut,
  isSmallSize = false,
  hideWishlistToggle = false,
} = defineProps<{
  basketItem: BasketItem
  isSoldOut: boolean
  isSmallSize?: boolean
  hideWishlistToggle?: boolean
}>()

const { image, alt, link } = useProductBaseInfo(basketItem.product)

const text = computed(() => {
  return basketItem.promotion?.customData.product?.badgeLabel
})

const style = computed(() => {
  const promotion = basketItem.promotion
  return getPromotionStyle(promotion)
})
</script>
