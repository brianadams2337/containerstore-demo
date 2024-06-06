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
    <div class="p-4">
      <BasketPromotionGiftsSlider v-bind="{ basketItem, products }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BasketItem } from '@scayle/storefront-nuxt'
import { useBasketItemPromotion, usePromotionGifts } from '~/composables'

const props = defineProps<{ basketItem: BasketItem }>()

const basketItem = computed(() => props.basketItem)

const { giftPromotion, giftBackgroundColorStyle, areGiftConditionsMet } =
  await useBasketItemPromotion(basketItem)

const { products, isGiftAlreadyAdded } = await usePromotionGifts(
  props.basketItem.product,
  'basket-item-promotion-gifts',
)
</script>
