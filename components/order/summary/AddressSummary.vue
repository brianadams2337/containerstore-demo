<template>
  <div class="bg-white">
    <AddressCards
      v-bind="{ items, shippingAddress, billingAddress }"
      class="mb-4 max-sm:hidden"
    />
    <AddressTabs :items="items" tabs-class="-mx-5" class="mb-8 md:hidden">
      <template #shipping>
        <AddressInformation v-if="shippingAddress" :address="shippingAddress" />
      </template>
      <template #billing>
        <AddressInformation v-if="billingAddress" :address="billingAddress" />
      </template>
    </AddressTabs>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNuxtApp } from '#app/nuxt'
import type { PropType } from 'vue'
import { pick, isEqual } from 'radash'

export type SummaryItem = {
  name: 'shipping' | 'billing'
  label: string
}

const props = defineProps({
  shippingAddress: {
    type: Object as PropType<OrderAddress>,
    default: null,
  },
  billingAddress: {
    type: Object as PropType<OrderAddress>,
    default: null,
  },
})

const { $i18n } = useNuxtApp()

const isShippingSameAsBillingAddress = computed(() => {
  if (!props.shippingAddress || !props.billingAddress) {
    return false
  }
  type RecipientProps = 'firstName' | 'lastName'
  type AddressProps = 'street' | 'houseNumber' | 'zipCode' | 'city'
  const propertiesToCheck = [
    'street',
    'houseNumber',
    'zipCode',
    'city',
    'additional',
  ] as AddressProps[]
  const recipientPropertiesToCheck = [
    'firstName',
    'lastName',
  ] as RecipientProps[]
  const shippingAddressProps = {
    ...pick(props.shippingAddress, propertiesToCheck),
    ...pick(props.shippingAddress.recipient, recipientPropertiesToCheck),
  }
  const billingAddressProps = {
    ...pick(props.billingAddress, propertiesToCheck),
    ...pick(props.billingAddress.recipient, recipientPropertiesToCheck),
  }
  return isEqual(shippingAddressProps, billingAddressProps)
})

const items = computed<SummaryItem[]>(() => {
  if (isShippingSameAsBillingAddress.value) {
    const label = $i18n.t('my_account.orders.address_label')
    return [{ name: 'shipping', label }]
  }
  const shippingLabel = $i18n.t('my_account.orders.shipping_address_label')
  const billingLabel = $i18n.t('my_account.orders.billing_address_label')
  return [
    { name: 'shipping', label: shippingLabel },
    { name: 'billing', label: billingLabel },
  ]
})
</script>
