<template>
  <SFOspDetailBox :title="$t('osp.order_details')">
    <ul class="flex flex-col gap-1 text-gray-600">
      <li v-if="orderConfirmedAt">
        <span class="font-medium">{{ $t('osp.order_date') }}:</span>
        {{ orderConfirmedAt }}
      </li>
      <li v-if="orderData.id">
        <span class="font-medium">{{ $t('osp.order_nr') }}:</span>
        {{ orderData.id }}
      </li>
      <li v-if="orderData.customer">
        <span class="font-medium">{{ $t('osp.customer_id') }}:</span>
        {{ orderData.customer.id }}
      </li>
    </ul>
  </SFOspDetailBox>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SFOspDetailBox from './SFOspDetailBox.vue'
import { useCurrentShop } from '#storefront/composables'
import type { Order } from '~/types/order'

const { orderData } = defineProps<{
  orderData: Order
}>()

const currentShop = useCurrentShop()

const orderConfirmedAt = computed(() => {
  if (!orderData.confirmedAt) {
    return
  }
  return new Date(orderData.confirmedAt).toLocaleDateString(
    currentShop.value?.locale?.replace('_', '-'),
  )
})
</script>
