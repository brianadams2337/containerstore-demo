<template>
  <div class="flex flex-row space-x-4">
    <div
      v-for="({ label, name }, idx) in items"
      :key="`headline-${name}-${idx}`"
      class="w-full rounded-md border border-gray-350 p-5 md:w-1/2"
      data-testid="address-card"
    >
      <SFHeadline tag="h3" size="sm" class="mb-2.5" is-uppercase>
        {{ label }}
      </SFHeadline>
      <AddressInformation
        v-if="shippingAddress || billingAddress"
        :address="getAddress(name)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SummaryItem } from './AddressSummary.vue'
import AddressInformation from './AddressInformation.vue'
import { SFHeadline } from '#storefront-ui/components'

type Props = {
  items: SummaryItem[]
  shippingAddress?: OrderAddress
  billingAddress?: OrderAddress
}

const props = defineProps<Props>()

const getAddress = (name: string) => {
  const address =
    name === 'shipping' ? props.shippingAddress : props.billingAddress
  return address as OrderAddress
}
</script>
