<template>
  <div
    class="relative shrink-0 overflow-hidden rounded-lg bg-white-smoke"
    :class="isSmallSize ? 'w-28 h-36' : 'h-48 w-36'"
  >
    <SFLocalizedLink v-if="link" :to="link" raw tabindex="-1">
      <SFProductImage
        v-if="image"
        :image="image"
        :alt="alt"
        :sizes="isSmallSize ? '112px' : '144px'"
        class="overflow-hidden rounded-lg"
        :class="[
          { 'opacity-60': isSoldOut },
          isSmallSize ? 'h-36 w-28' : 'h-48 w-36',
        ]"
      />
      <SFPromotionBadge
        v-if="productPromotion || isGift"
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
import { useI18n } from '#i18n'
import SFLocalizedLink from '~/components/SFLocalizedLink.vue'
import SFProductImage from '~/components/product/SFProductImage.vue'
import SFWishlistToggle from '~/components/product/SFWishlistToggle.vue'
import { useProductBaseInfo, useProductPromotions } from '~/composables'
import { isFreeGiftBasketItem } from '#storefront-promotions/utils'
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
const { promotion: productPromotion } = useProductPromotions(basketItem.product)
const { t } = useI18n()

const isGift = computed(() => {
  return isFreeGiftBasketItem(basketItem)
})

const text = computed(() => {
  if (isGift.value) {
    return t('pdp.promotion.free_label')
  }

  return productPromotion.value?.customData?.product?.badgeLabel
})

const style = computed(() => {
  const promotion = basketItem.promotion || productPromotion.value
  return getPromotionStyle(promotion)
})
</script>
