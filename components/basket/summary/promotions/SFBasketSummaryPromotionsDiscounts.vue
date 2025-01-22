<template>
  <div class="flex flex-col gap-1 text-sm font-medium leading-3.5">
    <div
      v-for="{ promotion, total } in itemsWithPromotionReductions"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BasketTotalPrice, BasketItem } from '@scayle/storefront-core'
import type { Promotion } from '~/types/promotion'
import { useFormatHelpers } from '#storefront/composables'
import { getTextColorStyle, getBackgroundColorStyle } from '~/utils'
import { AlphaColorMap } from '~/constants'
import { useBasketReductions } from '~/composables/useBasketReductions'

const { cost, basketItems } = defineProps<{
  cost: BasketTotalPrice
  basketItems: BasketItem[]
}>()

const { itemsWithPromotionReductions } = useBasketReductions(
  () => cost,
  () => basketItems,
)

const getHeadlineParts = (promotion: Promotion): string => {
  return promotion.customData.headlineParts?.at(0) ?? ''
}

const { formatCurrency } = useFormatHelpers()
</script>
