<template>
  <div
    class="flex w-full flex-col px-5 py-8 lg:ml-7 lg:mr-13 lg:w-3/5 lg:items-end"
  >
    <div>
      <SFHeadline size="xl" tag="h1">
        {{ $t('osp.title') }}
      </SFHeadline>
      <SFOspGreetingBox :order-data="orderData" class="mt-4" />
      <div class="max-w-xl text-sm sm:grid">
        <div class="mt-10 grid w-full grid-cols-2 gap-y-8 lg:grid-cols-3">
          <SFOspBasicOrderData v-bind="orderData" />
          <SFOspAddressInformation
            v-if="orderData.address"
            :address="orderData.address.shipping"
          />
          <div v-if="orderData.payment?.[0].key">
            <SFHeadline size="sm" tag="h2" is-uppercase class="mb-3">
              {{ $t('osp.payment') }}
            </SFHeadline>
            <SFPaymentIcon :paid-with="orderData.payment[0].key" />
          </div>
        </div>
        <SFOspDeliveryDate
          v-if="deliveryDate"
          class="sm:hidden"
          :delivery-date="deliveryDate"
        />
        <SFOspCtaButtons
          :order-data="orderData"
          class="mt-4 w-full max-md:hidden"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SFOspBasicOrderData from './SFOspBasicOrderData.vue'
import SFOspAddressInformation from './SFOspAddressInformation.vue'
import SFOspDeliveryDate from './SFOspDeliveryDate.vue'
import SFOspCtaButtons from './SFOspCtaButtons.vue'
import { SFHeadline } from '#storefront-ui/components'
import SFPaymentIcon from '~/components/order/SFPaymentIcon.vue'
import SFOspGreetingBox from '~/components/osp/SFOspGreetingBox.vue'
import type { Order, DeliveryDate } from '~/types/order'

defineProps<{
  orderData: Order
  deliveryDate: DeliveryDate
}>()
</script>
