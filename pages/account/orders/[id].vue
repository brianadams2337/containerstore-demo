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
        <OrderItems v-bind="{ orderItems, packages, variants }" />
        <PaymentSummary
          v-bind="{ totalAmount, deliveryCost }"
          :paid-with="orderDetails.payment && orderDetails.payment[0].key"
        />
      </template>
    </div>
  </PageContent>
</template>

<script setup lang="ts">
const route = useRoute()
const paramId = computed(() => +route.params.id)

const { isGreaterOrEquals } = useViewport()

const { data: orderDetails, fetching } = await useOrder({
  params: { orderId: paramId.value },
  key: `orderId-${paramId.value}`,
})
const variantIds = computed(() => {
  const ids =
    orderDetails.value?.items?.map((it) => it.variant.id as number) ?? []
  return useUnique(ids)
})

const { data: variants } = await useVariant({
  params: { ids: variantIds.value },
  key: `variant-${paramId.value}`,
})

const totalAmount = computed(() => orderDetails.value?.cost.withTax ?? 0)

const deliveryCost = computed(() => {
  return (
    orderDetails.value?.cost.appliedFees
      ?.filter(({ category }) => category === 'delivery')
      ?.reduce((acc, fee) => {
        return acc + fee.amount.withTax
      }, 0) || 0
  )
})

const shippingAddress = computed(() => {
  return orderDetails.value?.address?.shipping
})
const billingAddress = computed(() => {
  return orderDetails.value?.address?.billing
})
const itemCount = computed(() => orderDetails.value?.items?.length || 0)
const packages = computed(() => orderDetails.value?.packages)
const orderItems = computed(() => (orderDetails.value as Order)?.items)

defineOptions({ name: 'OrderDetailsView' })
definePageMeta({ pageType: 'account_area:order_id' })
</script>
