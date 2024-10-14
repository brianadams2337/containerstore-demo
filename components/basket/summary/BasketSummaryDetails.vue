<template>
  <div
    class="flex flex-col justify-between gap-2 text-sm font-bold text-gray-600"
  >
    <div class="flex justify-between">
      <div>{{ $t('basket.subtotal') }}</div>
      <div v-if="totalCostWithoutReductions">
        {{ formatCurrency(totalCostWithoutReductions) }}
      </div>
    </div>

    <div class="flex justify-between">
      <div>{{ $t('basket.shipping') }}</div>
      <div>{{ $t('basket.shipping_free') }}</div>
    </div>

    <BasketSummarySaleCampaign
      v-if="hasItemsWithSaleReductions"
      type="sale"
      :price="aggregatedSalePrice"
    />
    <BasketSummarySaleCampaign
      v-if="hasItemsWithCampaignReductions"
      type="campaign"
      :price="aggregatedCampaignPrice"
    />
    <BasketSummaryPromotions />

    <hr class="col-span-full my-4 border border-gray-350" />

    <div class="flex justify-between">
      <div class="opacity-50">
        {{ $t('basket.total') }}
      </div>
      <div class="">
        <div v-if="totalCost" class="text-xl">
          {{ formatCurrency(totalCost) }}
        </div>
        <div class="text-2xs opacity-50">
          {{ $t('basket.including_vat') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BasketSummarySaleCampaign from './BasketSummarySaleCampaign.vue'
import BasketSummaryPromotions from './promotions/BasketSummaryPromotions.vue'
import { useFormatHelpers } from '#storefront/composables'
import { useBasketReductions } from '~/composables'

const { formatCurrency } = useFormatHelpers()

const {
  totalCost,
  totalCostWithoutReductions,
  hasItemsWithSaleReductions,
  hasItemsWithCampaignReductions,
  aggregatedSalePrice,
  aggregatedCampaignPrice,
} = useBasketReductions()
</script>
