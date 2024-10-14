<template>
  <div class="flex w-full justify-between">
    <div class="flex w-full items-center justify-between">
      <span class="text-red">{{ $t('basket.summary.' + type) }}</span>
      <span class="text-sm font-semibold leading-4 text-red">
        {{ formatCurrency(Math.abs(price) * -1) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFormatHelpers } from '#storefront/composables'

const { formatCurrency } = useFormatHelpers()

const { type, price } = defineProps<{
  type: 'campaign' | 'sale'
  price: number
}>()
</script>
