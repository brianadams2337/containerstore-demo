<template>
  <template v-if="hasItemsWithSaleReductions">
    <div class="flex w-full justify-between">
      <div class="flex w-full items-center justify-between">
        <span class="text-red">{{ $t('basket.summary.sale') }}</span>
        <span class="text-sm font-semibold leading-[1.0625rem] text-red">{{
          withNegativePrefix(formatCurrency(aggregatedSalePrice))
        }}</span>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { useBasketReductions } from '~/composables/useBasketReductions'
const { formatCurrency } = useFormatHelpers()

const { hasItemsWithSaleReductions, aggregatedSalePrice, withNegativePrefix } =
  await useBasketReductions()
</script>
