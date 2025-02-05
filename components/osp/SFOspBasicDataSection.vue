<template>
  <div class="w-full md:container md:w-1/2 md:pl-0 md:pr-6 lg:w-3/5">
    <SFHeadline class="mt-4" size="xl" tag="h1">
      {{ $t('osp.title') }}
    </SFHeadline>
    <div class="mt-16 space-y-2">
      <SFHeadline size="lg" is-uppercase class="flex items-center">
        <IconCheckmark class="relative top-[-2px] mr-2 size-5" />
        {{ $t('osp.intro') }}
        {{ orderData.customer?.firstName }}
      </SFHeadline>
    </div>
    <div class="max-w-xl text-sm sm:grid">
      <div class="text-sm">
        {{ $t('osp.email_send') }}
      </div>
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
      <div class="my-8 flex space-x-4 sm:mt-12">
        <SFButton variant="tertiary" :to="getLocalizedRoute(routeList.home)">
          {{ $t('global.continue_shopping_label') }}
        </SFButton>
        <SFButton
          v-if="orderData.id"
          variant="primary"
          :to="getOrderDetailsRoute(orderData.id)"
        >
          {{ $t('osp.order_details') }}
        </SFButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SFOspBasicOrderData from './SFOspBasicOrderData.vue'
import SFOspAddressInformation from './SFOspAddressInformation.vue'
import SFOspDeliveryDate from './SFOspDeliveryDate.vue'
import { useRouteHelpers } from '~/composables/useRouteHelpers'
import { routeList } from '~/utils/route'
import { SFHeadline, SFButton } from '#storefront-ui/components'
import SFPaymentIcon from '~/components/order/SFPaymentIcon.vue'
import type { Order, DeliveryDate } from '~/types/order'

defineProps<{
  orderData: Order
  deliveryDate: DeliveryDate
}>()

const { getOrderDetailsRoute, getLocalizedRoute } = useRouteHelpers()
</script>
