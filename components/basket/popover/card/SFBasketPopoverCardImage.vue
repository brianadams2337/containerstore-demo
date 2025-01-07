<template>
  <div class="relative w-20 flex-none shrink-0 rounded-md bg-gray-200 p-2">
    <SFProductImage
      v-if="image"
      :image="image"
      :alt="alt"
      fit="cover"
      height="144"
      sizes="xl:100vw lg:100vw lg:100vw lg:100vw xs:100vw"
    />
    <SFProductPromotionFreeGiftBadge
      v-if="isFreeGift"
      :background-color-style="backgroundColorStyle"
      class="absolute bottom-2 left-2"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BasketItem } from '@scayle/storefront-nuxt'
import SFProductImage from '~/components/product/SFProductImage.vue'
import SFProductPromotionFreeGiftBadge from '~/components/product/promotion/gifts/SFProductPromotionFreeGiftBadge.vue'
import {
  useBasketItem,
  useBasketItemPromotion,
  useProductBaseInfo,
} from '~/composables'

const props = defineProps<{ item: BasketItem }>()

const basketItem = computed(() => props.item)

const { image, product } = useBasketItem(basketItem)
const { alt } = useProductBaseInfo(product)

const { isFreeGift, backgroundColorStyle } = useBasketItemPromotion(basketItem)
</script>
