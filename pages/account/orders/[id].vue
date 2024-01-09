<template>
  <PageContent>
    <div v-if="paramId">
      <OrderLoadingState v-if="fetching" />
      <template v-else-if="orderDetails && !fetching">
        <template
          v-if="itemCount && orderDetails.shop?.id && orderDetails.confirmedAt"
        >
          <OrderHeader
            v-show="isGreaterOrEquals('md')"
            :order-id="orderDetails.id"
            :shop-id="orderDetails.shop.id"
            :item-count="itemCount"
            :order-date="orderDetails.confirmedAt"
          />
        </template>
        <AddressSummary
          v-if="shippingAddress || billingAddress"
          v-bind="{ shippingAddress, billingAddress }"
        />
        <OrderItems />
        <PaymentSummary />
      </template>
    </div>
  </PageContent>
</template>

<script setup lang="ts">
const route = useRoute()
const paramId = computed(() => +route.params.id)

const { isGreaterOrEquals } = useViewport()

const { orderDetails, fetching, shippingAddress, billingAddress, itemCount } =
  await useOrders()

defineOptions({ name: 'OrderDetailsView' })
definePageMeta({ pageType: 'account_area:order_id' })
</script>
