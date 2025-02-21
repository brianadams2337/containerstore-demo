<template>
  <div class="contents">
    <SFOspDetailBox
      :title="
        isSingleAddress
          ? $t('osp.delivery_and_billing_address')
          : $t('osp.delivery_address')
      "
      :class="{ 'col-span-full': isSingleAddress }"
    >
      <div class="flex flex-col gap-1">
        <p
          v-for="(formattedAddress, index) in getFormattedLocaleAddresses(
            address.shipping,
          )"
          :key="`${formattedAddress}-${index}`"
          class="text-gray-600"
        >
          {{ formattedAddress }}
        </p>
      </div>
    </SFOspDetailBox>
    <SFOspDetailBox
      v-if="address.billing && !isSingleAddress"
      :title="$t('osp.billing_address')"
    >
      <div class="flex flex-col gap-1">
        <p
          v-for="(formattedAddress, index) in getFormattedLocaleAddresses(
            address.billing,
          )"
          :key="`${formattedAddress}-${index}`"
          class="text-gray-600"
        >
          {{ formattedAddress }}
        </p>
      </div>
    </SFOspDetailBox>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SFOspDetailBox from './SFOspDetailBox.vue'
import { getFormattedLocaleAddresses } from '~/utils'
import type { OrderAddress } from '~/types/order'

const { address } = defineProps<{
  address: { shipping: OrderAddress; billing?: OrderAddress }
}>()

const isSingleAddress = computed(() => {
  return !address.billing || address.billing.id === address.shipping.id
})
</script>
