<template>
  <div
    v-if="isGiftAlreadyAdded && hasQuantityLeft && !isGiftApplied"
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

const { giftPromotion, giftBackgroundColorStyle, giftConditions } =
  await useBasketItemPromotion(basketItem)

const quantityLeft = computed(() => {
  if (!giftConditions.value?.minQuantity) {
    return
  }
  return giftConditions.value.minQuantity - basketItem.value.quantity
})

const hasQuantityLeft = computed(() => {
  return quantityLeft.value && quantityLeft.value > 0
})

const { isGiftAlreadyAdded, isGiftApplied } = await usePromotionGifts(
  props.basketItem.product,
)
</script>
