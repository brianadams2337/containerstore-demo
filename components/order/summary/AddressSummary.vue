<template>
  <div class="bg-white">
    <AddressCards
      :items="items"
      :shipping-address="shippingAddress"
      :billing-address="billingAddress"
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
import AddressCards from './AddressCards.vue'
import AddressTabs from './AddressTabs.vue'
import AddressInformation from './AddressInformation.vue'
import { isEqual } from '~/utils/object'
import { useNuxtApp } from '#app'
import type { OrderAddress } from '~/types/order'

export type SummaryItem = {
  name: 'shipping' | 'billing'
  label: string
}

type Props = {
  shippingAddress?: OrderAddress
  billingAddress?: OrderAddress
}

const props = defineProps<Props>()

const { $i18n } = useNuxtApp()

const pickElements = (
  objectValue: Record<string, unknown>,
  keysList: string[],
) =>
  Object.fromEntries(
    keysList
      .filter((key) => key in objectValue)
      .map((key) => [key, objectValue[key]]),
  )

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
    ...pickElements(props.shippingAddress, propertiesToCheck),
    ...pickElements(
      props.shippingAddress.recipient,
      recipientPropertiesToCheck,
    ),
  }

  const billingAddressProps = {
    ...pickElements(props.billingAddress, propertiesToCheck),
    ...pickElements(props.billingAddress.recipient, recipientPropertiesToCheck),
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
