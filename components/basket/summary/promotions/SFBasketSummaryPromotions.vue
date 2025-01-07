<template>
  <div
    v-if="hasItemsWithPromotionReductions"
    data-testid="basket-summary-promotions"
    class="flex flex-col justify-between gap-2.5"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center justify-between">
        <SFBasketSummaryPromotionsToggle v-model="showDiscountSummary" />
      </div>

      <span
        v-if="totalPromotionsReductions"
        class="text-sm font-semibold leading-5 text-primary"
      >
        {{ total }}
      </span>
    </div>
    <SFFadeInFromBottomTransition>
      <SFBasketSummaryPromotionsDiscounts v-if="showDiscountSummary" />
    </SFFadeInFromBottomTransition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SFBasketSummaryPromotionsDiscounts from './SFBasketSummaryPromotionsDiscounts.vue'
import SFBasketSummaryPromotionsToggle from './SFBasketSummaryPromotionsToggle.vue'
import { useFormatHelpers } from '#storefront/composables'
import { useBasketReductions } from '~/composables'
import { SFFadeInFromBottomTransition } from '#storefront-ui/components'

const {
  hasItemsWithPromotionReductions,
  totalPromotionsReductions,
  withNegativePrefix,
} = useBasketReductions()

const showDiscountSummary = defineModel<boolean>({ default: false })

const { formatCurrency } = useFormatHelpers()

const total = computed(() => {
  return withNegativePrefix(formatCurrency(totalPromotionsReductions.value))
})
</script>
