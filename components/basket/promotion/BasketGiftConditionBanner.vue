<template>
  <PromotionGiftConditionBanner
    v-if="giftPromotion && !areGiftConditionsMet"
    :background-color="giftBackgroundColorStyle.backgroundColor"
    :schedule-to="giftPromotion.schedule.to"
    :label="label"
  />
</template>

<script setup lang="ts">
import type { BasketItem } from '@scayle/storefront-nuxt'

const props = defineProps<{ basketItem: BasketItem }>()

const basketItem = computed(() => props.basketItem)

const {
  giftPromotion,
  giftBackgroundColorStyle,
  minOrderValueLeft,
  quantityLeftForGiftConditions: quantityLeft,
  areGiftConditionsMet,
} = await useBasketItemPromotion(basketItem)

const { label } = usePromotionConditionBanner(minOrderValueLeft, quantityLeft)
</script>
