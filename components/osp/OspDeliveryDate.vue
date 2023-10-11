<template>
  <div class="hidden space-y-2 py-6 sm:block">
    <Headline size="sm" tag="h2" is-uppercase class="mb-3">
      {{ $t('osp.estimated_deliver_date') }}
    </Headline>
    <div class="text-gray-800">
      {{ formatDate(deliveryDate.minimum) }} -
      {{ formatDate(deliveryDate.maximum) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@scayle/storefront-nuxt'

defineProps({
  deliveryDate: {
    type: Object as PropType<DeliveryDate>,
    required: true,
  },
})
</script>
