<template>
  <div class="flex flex-row space-x-4">
    <div
      v-for="({ label, name }, idx) in items"
      :key="`headline-${name}-${idx}`"
      class="w-full rounded-md border border-gray-350 p-5 md:w-1/2"
      data-test-id="address-card">
      <Headline tag="h3" size="sm" class="mb-2.5">
        {{ label }}
      </Headline>
      <AddressInformation
        v-bind="name === 'shipping' ? shippingAddress : billingAddress" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SummaryItem } from './AddressSummary.vue'

defineProps({
  items: {
    type: Array as PropType<SummaryItem[]>,
    required: true,
  },
  shippingAddress: {
    type: Object as PropType<OrderAddress>,
    default: null,
  },
  billingAddress: {
    type: Object as PropType<OrderAddress>,
    default: null,
  },
})
</script>
