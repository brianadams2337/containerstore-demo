<template>
  <div
    v-if="!areGiftConditionsMet"
    class="flex justify-between rounded-md px-4 py-2 text-white"
    :style="giftBackgroundColorStyle"
  >
    <Headline size="xs" is-bold>
      {{ label }}
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

const { t } = useI18n()
const { formatCurrency } = useFormatHelpers()

const basketItem = computed(() => props.basketItem)

const {
  giftPromotion,
  giftBackgroundColorStyle,
  movLeft,
  quantityLeftForGiftConditions: quantityLeft,
  areGiftConditionsMet,
} = await useBasketItemPromotion(basketItem)

const label = computed(() => {
  const cost = formatCurrency(movLeft.value)

  const quantityLabel = t('basket.promotion.quantity_left', {
    quantityLeft: quantityLeft.value,
  })
  const movLabel = t('basket.promotion.mov', { cost })
  const quantityAndCostLabels = t('basket.promotion.quantity_and_mov', {
    quantityLeft: quantityLeft.value,
    cost,
  })

  if (movLeft.value && quantityLeft.value) {
    return quantityAndCostLabels
  }

  return movLeft.value ? movLabel : quantityLabel
})
</script>
