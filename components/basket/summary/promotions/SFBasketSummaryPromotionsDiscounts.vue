<template>
  <ul class="flex flex-col gap-1 text-sm font-medium leading-3.5">
    <li
      v-for="{ promotion, total } in validPromotions"
      :key="promotion?.id"
      class="flex h-7 items-center justify-between gap-1.5 rounded-md px-2"
      data-testid="basket-summary-promotion-item"
      :style="getPromotionStyle(promotion)"
    >
      <span v-if="promotion?.customData">
        {{ getHeadlineParts(promotion) }}
      </span>
      <span
        class="font-variable leading-2.5"
        data-testid="basket-discount-promotion"
      >
        {{ formatCurrency(-Math.abs(total)) }}
      </span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { Promotion } from '@scayle/storefront-nuxt'
import { useFormatHelpers } from '#storefront/composables'
import { getPromotionStyle } from '~/utils'
import type { PromotionReductionItem } from '#storefront-promotions/composables'

const { validPromotions: validPromotions = [] } = defineProps<{
  validPromotions?: PromotionReductionItem[]
}>()

const getHeadlineParts = (promotion: Promotion): string => {
  return promotion.customData.headline || promotion.name
}

const { formatCurrency } = useFormatHelpers()
</script>
