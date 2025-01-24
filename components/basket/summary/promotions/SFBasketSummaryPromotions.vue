<template>
  <div
    v-if="basketPromotionSummaries.size"
    data-testid="basket-summary-promotions"
    class="flex flex-col justify-between gap-3"
  >
    <div class="flex items-center justify-between">
      <SFBasketSummaryPromotionsToggle
        id="promotion-discounts-header"
        v-model:visible="isPromotionsSummaryVisible"
        aria-controls="promotion-discounts-content"
      />
      <span
        v-if="totalPromotionReductions"
        class="text-base font-semi-bold-variable leading-3.5"
      >
        {{ formatCurrency(-Math.abs(totalPromotionReductions)) }}
      </span>
    </div>
    <SFFadeInFromBottomTransition>
      <SFBasketSummaryPromotionsDiscounts
        v-if="isPromotionsSummaryVisible"
        id="promotion-discounts-content"
        role="region"
        aria-labelledby="promotion-discounts-header"
        :basket-promotion-summaries="basketPromotionSummaries"
      />
    </SFFadeInFromBottomTransition>
  </div>
</template>

<script setup lang="ts">
import type { BasketTotalPrice, BasketItem } from '@scayle/storefront-core'
import SFBasketSummaryPromotionsDiscounts from './SFBasketSummaryPromotionsDiscounts.vue'
import SFBasketSummaryPromotionsToggle from './SFBasketSummaryPromotionsToggle.vue'
import { useFormatHelpers } from '#storefront/composables'
import { useBasketPromotionReductions } from '~/composables/useBasketPromotionReductions'
import { SFFadeInFromBottomTransition } from '#storefront-ui/components'

const { cost, basketItems } = defineProps<{
  cost: BasketTotalPrice
  basketItems: BasketItem[]
}>()

const { basketPromotionSummaries, totalPromotionReductions } =
  useBasketPromotionReductions(
    // We need to pass destructured props as a getter in order to keep reactivity:
    // https://vuejs.org/guide/components/props.html#passing-destructured-props-into-functions
    () => cost,
    () => basketItems,
  )

const isPromotionsSummaryVisible = defineModel<boolean>('visible', {
  default: false,
})

const { formatCurrency } = useFormatHelpers()
</script>
