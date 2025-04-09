<template>
  <SFOspDetailBox
    v-if="paymentKey"
    :title="$t('osp.payment_details')"
    data-testid="osp-payment-data"
  >
    <ul class="flex flex-col gap-1 text-gray-600">
      <li>
        <span class="font-medium">{{ $t('osp.payment_method') }}:</span>
        {{ $t('global.payment_key.' + paymentKey) }}
      </li>
    </ul>
  </SFOspDetailBox>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import SFOspDetailBox from './SFOspDetailBox.vue'
import type { Order } from '~/types/order'

const { paymentData } = defineProps<{
  paymentData: NonNullable<Order['payment']>
}>()

const paymentKey = computed(() => {
  return paymentData[0].key
})
</script>
