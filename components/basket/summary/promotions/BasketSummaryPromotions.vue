<template>
  <div
    v-if="hasItemsWithPromotionReductions"
    data-test-id="basket-summary-promotions"
    class="flex flex-col justify-between gap-[.625rem]"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center justify-between">
        <BasketSummaryPromotionsToggle v-model="showDiscountSummary" />
      </div>

      <span
        v-if="totalPromotionsReductions"
        class="text-sm font-semibold leading-5 text-primary"
      >
        {{ total }}
      </span>
    </div>
    <SFFadeInFromBottomTransition>
      <BasketSummaryPromotionsDiscounts v-if="showDiscountSummary" />
    </SFFadeInFromBottomTransition>
  </div>
</template>

<script setup lang="ts">
import { computed, defineModel } from 'vue'
import { useFormatHelpers } from '#storefront/composables'
import { useBasketReductions } from '~/composables'

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
