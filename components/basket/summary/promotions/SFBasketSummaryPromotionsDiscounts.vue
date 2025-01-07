<template>
  <div class="flex flex-col gap-2">
    <template
      v-for="{ promotion, total } in itemsWithPromotionsReductions"
      :key="promotion?.id"
    >
      <div
        class="flex items-center justify-between rounded px-2 py-1.5 text-sm font-semibold leading-[17px]"
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
        <div class="flex flex-row items-center gap-1.5">
          <IconDiscount
            class="size-3"
            :style="getTextColorStyle(promotion?.customData.colorHex, 100)"
          />
          <span v-if="promotion?.customData" class="text-xs leading-5">
            {{ getHeadlineParts(promotion) }}</span
          >
        </div>
        <span class="text-xs font-medium leading-5 text-primary">
          {{ withNegativePrefix(formatCurrency(total)) }}
        </span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useFormatHelpers } from '#storefront/composables'
import { getTextColorStyle, getBackgroundColorStyle } from '~/utils'
import { AlphaColorMap } from '~/constants'
import { useBasketReductions } from '~/composables'

const { itemsWithPromotionsReductions, getHeadlineParts, withNegativePrefix } =
  useBasketReductions()

const { formatCurrency } = useFormatHelpers()
</script>
