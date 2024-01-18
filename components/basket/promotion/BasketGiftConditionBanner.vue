<template>
  <div
    v-if="hasQuantityLeft"
    class="flex justify-between rounded-md px-4 py-2 text-white"
    :style="giftBackgroundColorStyle"
  >
    <Headline size="xs" is-bold>
      {{ $t('basket.promotion.gift_conditional_label', { quantityLeft }) }}
    </Headline>
    <PromotionCountdown
      v-if="giftPromotion"
      :until="giftPromotion.schedule.to"
      borderless
    />
  </div>
</template>

<script setup lang="ts">
import type { BasketItem } from '@scayle/storefront-nuxt'

const props = defineProps<{ basketItem: BasketItem }>()

const basketItem = computed(() => props.basketItem)

const {
  giftPromotion,
  giftBackgroundColorStyle,
  hasQuantityLeftForGiftConditions: hasQuantityLeft,
  quantityLeftForGiftConditions: quantityLeft,
} = await useBasketItemPromotion(basketItem)
</script>
