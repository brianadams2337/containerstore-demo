<template>
  <div class="rounded-lg border bg-gray-200 font-semi-bold-variable">
    <div
      class="rounded-lg border-0 bg-white p-2"
      data-testid="osp-delivery-date"
    >
      <div class="text-base text-gray-500">
        {{ $t('order_information.order_details.estimated_delivery_date') }}:
        {{ formatLocaleDate(new Date(Date.parse(deliveryDate.minimum))) }} -
        {{ formatLocaleDate(new Date(Date.parse(deliveryDate.maximum))) }}
      </div>
    </div>
    <div class="p-2 text-xs text-gray-600" data-testid="osp-carrier">
      {{ $t('order_information.order_details.delivered_by') }}
      <!--TODO do not use dynamic translation key -->
      {{ $t('global.carrier_key.' + sender) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DeliveryDate } from '~/types/order'
import { useFormatDate } from '~/composables'

defineProps<{ deliveryDate: DeliveryDate; sender: string }>()

const { formatLocaleDate } = useFormatDate()
</script>
