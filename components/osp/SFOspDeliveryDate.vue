<template>
  <div class="rounded-lg border bg-gray-200 font-semi-bold-variable">
    <div class="rounded-lg border-0 bg-white p-2">
      <div class="text-base text-gray-500">
        {{ $t('osp.estimated_delivery_date') }}:
        {{ formatDate(new Date(Date.parse(deliveryDate.minimum))) }} -
        {{ formatDate(new Date(Date.parse(deliveryDate.maximum))) }}
      </div>
    </div>
    <div class="p-2 text-xs text-gray-600">
      {{ $t('osp.delivered_by') }}
      {{ $t('osp.carrier_key.' + sender) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DeliveryDate } from '~/types/order'

import { useCurrentShop } from '#storefront/composables'

const currentShop = useCurrentShop()

const formatDate = (value: Date): string => {
  return new Intl.DateTimeFormat(currentShop.value.locale, {
    dateStyle: 'short',
  }).format(value)
}

defineProps<{ deliveryDate: DeliveryDate; sender: string }>()
</script>
