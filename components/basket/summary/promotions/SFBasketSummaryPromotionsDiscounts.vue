<template>
  <ul class="flex flex-col gap-1 text-sm font-medium leading-3.5">
    <li
      v-for="{ promotion, total } in basketPromotionSummaries.values() || []"
      :key="promotion?.id"
      class="flex h-7 items-center justify-between gap-1.5 rounded-md px-2"
      data-testid="basket-summary-promotion-item"
      :style="{
        ...getBackgroundColorStyle(
          promotion?.customData.colorHex,
          AlphaColorMap.ALPHA_10,
        ),
        ...getTextColorStyle(
          promotion?.customData.colorHex,
          AlphaColorMap.ALPHA_100,
        ),
      }"
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
import type { Promotion } from '~/types/promotion'
import { useFormatHelpers } from '#storefront/composables'
import { getTextColorStyle, getBackgroundColorStyle } from '~/utils'
import { AlphaColorMap } from '~/constants'
import type { PromotionReductionItem } from '~/composables/useBasketReductions'

const { basketPromotionSummaries } = defineProps<{
  basketPromotionSummaries: Map<string, PromotionReductionItem>
}>()

const getHeadlineParts = (promotion: Promotion): string => {
  return promotion.customData.headlineParts?.at(0) ?? ''
}

const { formatCurrency } = useFormatHelpers()
</script>
