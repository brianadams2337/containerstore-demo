<template>
  <div class="w-full md:container md:w-1/2 md:pl-0 md:pr-6 lg:w-3/5">
    <div class="mt-16 space-y-2">
      <Headline size="lg" is-uppercase class="flex items-center">
        <IconCheckmark class="relative top-[-2px] mr-2 size-5" />
        {{ $t('osp.intro') }}
        {{ orderData.customer?.firstName }}
      </Headline>
    </div>
    <div class="max-w-xl text-sm sm:grid">
      <div class="text-sm">
        {{ $t('osp.email_send') }}
      </div>
      <div class="mt-10 grid w-full grid-cols-2 gap-y-8 lg:grid-cols-3">
        <OspBasicOrderData v-bind="orderData" />
        <OspAddressInformation :address="orderData.address" />
        <div v-if="orderData.payment?.[0].key">
          <Headline size="sm" tag="h2" is-uppercase class="mb-3">
            {{ $t('osp.payment') }}
          </Headline>
          <PaymentIcon :paid-with="orderData.payment[0].key" />
        </div>
      </div>
      <OspDeliveryDate
        v-if="deliveryDate"
        class="sm:hidden"
        :delivery-date="deliveryDate"
      />
      <div class="my-8 flex space-x-4 sm:mt-12">
        <AppButton type="tertiary" :to="routeList.home">
          {{ $t('global.continue_shopping_label') }}
        </AppButton>
        <AppButton
          v-if="orderData.id"
          type="primary"
          :to="getOrderDetailsRoute(orderData.id)"
        >
          {{ $t('osp.order_details') }}
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Props = {
  orderData: Order
  deliveryDate: DeliveryDate
}

defineProps<Props>()

const { getOrderDetailsRoute } = useRouteHelpers()
</script>
