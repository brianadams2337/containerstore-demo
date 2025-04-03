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
          class="flex justify-between text-red"
        >
          <h2>{{ $t(`basket.summary.${reduction.category}`) }}</h2>
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
import type { BasketResponseData } from '@scayle/storefront-nuxt'
import SFBasketSummaryPromotions from './promotions/SFBasketSummaryPromotions.vue'
import { useFormatHelpers } from '#storefront/composables'

const { formatCurrency } = useFormatHelpers()

const { basket } = defineProps<{ basket: BasketResponseData }>()
</script>
