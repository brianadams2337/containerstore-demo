<template>
  <div class="bg-white">
    <SFAddressCards
      :items="items"
      :shipping-address="shippingAddress"
      :billing-address="billingAddress"
      class="mb-4 max-sm:hidden"
    />
    <SFAddressTabs :items="items" tabs-class="-mx-5" class="mb-8 md:hidden">
      <template #shipping>
        <SFAddressInformation
          v-if="shippingAddress"
          :address="shippingAddress"
        />
      </template>
      <template #billing>
        <SFAddressInformation v-if="billingAddress" :address="billingAddress" />
      </template>
    </SFAddressTabs>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SFAddressCards from './SFAddressCards.vue'
import SFAddressTabs from './SFAddressTabs.vue'
import SFAddressInformation from './SFAddressInformation.vue'
import { isEqual } from '~/utils/object'
import type { OrderAddress } from '~/types/order'
import { useI18n } from '#i18n'

export type SummaryItem = {
  name: 'shipping' | 'billing'
  label: string
}

const { shippingAddress, billingAddress } = defineProps<{
  shippingAddress?: OrderAddress
  billingAddress?: OrderAddress
}>()

const { t } = useI18n()

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
  if (!shippingAddress || !billingAddress) {
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
    ...pickElements(shippingAddress, propertiesToCheck),
    ...pickElements(shippingAddress.recipient, recipientPropertiesToCheck),
  }

  const billingAddressProps = {
    ...pickElements(billingAddress, propertiesToCheck),
    ...pickElements(billingAddress.recipient, recipientPropertiesToCheck),
  }

  return isEqual(shippingAddressProps, billingAddressProps)
})

const items = computed<SummaryItem[]>(() => {
  if (isShippingSameAsBillingAddress.value) {
    const label = t('my_account.orders.address_label')
    return [{ name: 'shipping', label }]
  }

  const shippingLabel = t('my_account.orders.shipping_address_label')
  const billingLabel = t('my_account.orders.billing_address_label')

  return [
    { name: 'shipping', label: shippingLabel },
    { name: 'billing', label: billingLabel },
  ]
})
</script>
