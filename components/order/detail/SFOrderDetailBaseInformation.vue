<template>
  <div
    class="grid grid-cols-1 gap-4 text-base font-normal text-gray-600 lg:grid-cols-2"
  >
    <SFOrderDetailBox :title="$t('my_account.orders.detail.order_details')">
      <div class="flex items-center gap-1">
        <span class="font-medium">
          {{ $t('my_account.orders.detail.order_date') }}:
        </span>
        {{ formatLocaleDate(orderDetails.confirmedAt) }}
      </div>
    </SFOrderDetailBox>
    <SFOrderDetailBox :title="$t('my_account.orders.detail.payment_details')">
      <div class="flex items-center gap-1">
        <span class="font-medium">
          {{ $t('my_account.orders.detail.payment_method') }}:
        </span>
        <span class="capitalize">
          {{ paymentKey }}
        </span>
      </div>
    </SFOrderDetailBox>
    <SFOrderDetailAddressBox
      :title="shippingAddressTitle"
      :address="address?.shipping"
      :class="{ 'col-span-full': areSameAddresses }"
    />
    <SFOrderDetailAddressBox
      v-if="!areSameAddresses"
      :address="address?.billing"
      :title="$t('my_account.orders.detail.billing_address')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SFOrderDetailBox from './SFOrderDetailBox.vue'
import SFOrderDetailAddressBox from './SFOrderDetailAddressBox.vue'
import type { Order } from '~/types/order'
import { useFormatDate } from '~/composables'
import { useI18n } from '#i18n'

const { t } = useI18n()

const { formatLocaleDate } = useFormatDate()

const { orderDetails } = defineProps<{ orderDetails: Order }>()

const address = computed(() => orderDetails.address)

const areSameAddresses = computed(() => {
  return address.value?.billing?.id === address.value?.shipping?.id
})

const shippingAddressTitle = computed(() => {
  return areSameAddresses.value
    ? t('my_account.orders.detail.delivery_and_billing_address')
    : t('my_account.orders.detail.delivery_address')
})

const paymentKey = computed(() => orderDetails.payment?.[0]?.key)
</script>
