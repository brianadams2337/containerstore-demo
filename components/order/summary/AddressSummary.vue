<template>
  <div class="bg-white">
    <AddressCards
      v-show="isGreaterOrEquals('md')"
      v-bind="{ items, shippingAddress, billingAddress }"
      class="mb-4" />
    <AddressTabs
      v-show="!isGreaterOrEquals('md')"
      :items="items"
      tabs-class="-mx-5"
      class="mb-8">
      <template #shipping>
        <AddressInformation v-bind="shippingAddress" />
      </template>
      <template #billing>
        <AddressInformation v-bind="billingAddress" />
      </template>
    </AddressTabs>
  </div>
</template>

<script setup lang="ts">
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

const { isGreaterOrEquals } = useViewport()

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
    ...usePick(props.shippingAddress, propertiesToCheck),
    ...usePick(props.shippingAddress.recipient, recipientPropertiesToCheck),
  }
  const billingAddressProps = {
    ...usePick(props.billingAddress, propertiesToCheck),
    ...usePick(props.billingAddress.recipient, recipientPropertiesToCheck),
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
