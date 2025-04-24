<template>
  <section
    class="flex flex-col gap-4 text-base font-semi-bold-variable leading-3.5"
  >
    <ul class="flex flex-col gap-4">
      <template
        v-for="reduction in basket.cost.appliedReductions"
        :key="reduction.category"
      >
        <li
          v-if="reduction.category !== 'promotion'"
          class="flex justify-between text-product-sale"
        >
          <h2>{{ getReductionCategory(reduction) }}</h2>
          <span :data-testid="`basket-discount-${reduction.category}`">
            {{ formatCurrency(-Math.abs(reduction.amount.absoluteWithTax)) }}
          </span>
        </li>
      </template>
    </ul>
    <SFBasketSummaryPromotions :basket="basket" />
  </section>
</template>

<script lang="ts" setup>
import type {
  AppliedReduction,
  BasketResponseData,
} from '@scayle/storefront-nuxt'
import SFBasketSummaryPromotions from './promotions/SFBasketSummaryPromotions.vue'
import { useI18n } from '#i18n'
import { useFormatHelpers } from '#storefront/composables'

const { formatCurrency } = useFormatHelpers()

const { basket } = defineProps<{ basket: BasketResponseData }>()

const { t } = useI18n()
const getReductionCategory = (reduction: AppliedReduction) => {
  switch (reduction.category) {
    case 'promotion':
      return t('basket_summary_reduction.promotion')
    case 'voucher':
      return t('basket_summary_reduction.voucher')
    case 'campaign':
      return t('basket_summary_reduction.campaign')
    case 'sale':
      return t('basket_summary_reduction.sale')
  }
}
</script>
