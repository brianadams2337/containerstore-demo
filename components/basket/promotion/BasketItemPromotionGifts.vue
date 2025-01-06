<template>
  <div
    v-if="!isGiftAlreadyAdded && areGiftConditionsMet"
    class="rounded-md border"
  >
    <div
      class="flex justify-between rounded-t-md px-4 py-2 text-white"
      :style="giftBackgroundColorStyle"
    >
      <SFHeadline size="xs" is-bold>
        {{ $t('basket.promotion.choose_free_gift') }}
      </SFHeadline>
      <PromotionCountdown
        v-if="giftPromotion"
        :time-until="giftPromotion.schedule.to"
      />
    </div>
    <div class="p-3">
      <BasketPromotionGiftsSlider
        v-if="products"
        :basket-item="basketItem"
        :products="products"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRef } from 'vue'
import type { BasketItem } from '@scayle/storefront-nuxt'
import BasketPromotionGiftsSlider from './BasketPromotionGiftsSlider.vue'
import { useBasketItemPromotion, usePromotionGifts } from '~/composables'
import PromotionCountdown from '~/components/promotion/PromotionCountdown.vue'
import { SFHeadline } from '#storefront-ui/components'

const props = defineProps<{ basketItem: BasketItem }>()

const { giftPromotion, giftBackgroundColorStyle, areGiftConditionsMet } =
  useBasketItemPromotion(toRef(props.basketItem))

const { products, isGiftAlreadyAdded } = usePromotionGifts(
  props.basketItem.product,
  giftPromotion,
  'basket-item-promotion-gifts',
)
</script>
