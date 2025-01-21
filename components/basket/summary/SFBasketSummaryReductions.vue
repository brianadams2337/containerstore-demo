<template>
  <section
    class="flex w-full flex-col gap-4 text-base font-semi-bold-variable leading-3.5"
  >
    <div v-if="totalSaleReductions" class="flex justify-between text-red">
      <h2>{{ $t('basket.summary.sale') }}</h2>
      <span>
        {{ formatCurrency(-Math.abs(totalSaleReductions)) }}
      </span>
    </div>
    <div v-if="totalCampaignReductions" class="flex justify-between text-red">
      <h2>{{ $t('basket.summary.campaign') }}</h2>
      <span>
        {{ formatCurrency(-Math.abs(totalCampaignReductions)) }}
      </span>
    </div>
    <SFBasketSummaryPromotions :cost="cost" :basket-items="basketItems" />
  </section>
</template>

<script lang="ts" setup>
import type { BasketTotalPrice, BasketItem } from '@scayle/storefront-nuxt'
import SFBasketSummaryPromotions from './promotions/SFBasketSummaryPromotions.vue'
import { useFormatHelpers } from '#storefront/composables'
import { useBasketReductions } from '~/composables'

const { formatCurrency } = useFormatHelpers()

const { cost, basketItems } = defineProps<{
  cost: BasketTotalPrice
  basketItems: BasketItem[]
}>()

const { totalCampaignReductions, totalSaleReductions } = useBasketReductions(
  () => cost,
  () => basketItems,
)
</script>
