<template>
  <component
    :is="icon.component"
    v-if="icon.component"
    class="h-8"
    :class="{ 'w-10': icon.width === 10, 'w-20': icon.width === 20 }"
  />
  <span v-else class="capitalize">{{ paidWith }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  IconPaymentVisa,
  IconPaymentKlarna,
  IconPaymentPaypal,
  IconPaymentRatepay,
  IconPaymentDinersclub,
  IconPaymentLastschrift,
  IconPaymentDiscover,
  IconPaymentMastercard,
} from '#components'

const props = defineProps({
  paidWith: { type: String, required: true },
})

type PaymentIconType = {
  component: unknown
  width: number
}

type PaymentIconsMapType = { [key: string]: PaymentIconType }

const paymentIconsMap: PaymentIconsMapType = {
  ratepay_directdebit: {
    component: IconPaymentLastschrift,
    width: 20,
  },
  computop_creditcard_visa: {
    component: IconPaymentVisa,
    width: 10,
  },
  computop_creditcard_mastercard: {
    component: IconPaymentMastercard,
    width: 10,
  },
  computop_creditcard_discover: {
    component: IconPaymentDiscover,
    width: 20,
  },
  computop_creditcard_dinersclub: {
    component: IconPaymentDinersclub,
    width: 20,
  },
  ratepay_invoice: {
    component: IconPaymentRatepay,
    width: 20,
  },
  klarna_paylater: {
    component: IconPaymentKlarna,
    width: 20,
  },
  paypal_instant: {
    component: IconPaymentPaypal,
    width: 20,
  },
}

const icon = computed(() => paymentIconsMap[props.paidWith] ?? {})
</script>
