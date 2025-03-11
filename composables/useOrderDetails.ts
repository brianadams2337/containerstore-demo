import { computed } from 'vue'
import { useOrder, useVariant } from '#storefront/composables'
import { useRoute } from '#app/composables/router'
import type { OrderProduct, OrderVariant } from '~/types/order'

export function useOrderDetails(key?: string) {
  if (!key) {
    // The key is auto-added so this will only be thrown if a nullish value is passed to the function
    throw Error('missing key argument')
  }
  const route = useRoute()
  const paramId = computed(() => +route.params.id)

  const { data: orderDetails, status } = useOrder<OrderProduct, OrderVariant>(
    {
      params: computed(() => ({ orderId: paramId.value })),
    },
    `orderId-${key}`,
  )

  const deliveryCost = computed(() => {
    return (orderDetails.value?.cost?.appliedFees ?? []).reduce(
      (total, { category, amount }) => {
        return category === 'delivery' ? total + amount.withTax : total
      },
      0,
    )
  })

  const shippingAddress = computed(() => {
    return orderDetails.value?.address?.shipping
  })

  const billingAddress = computed(() => {
    return orderDetails.value?.address?.billing
  })

  const totalAmount = computed(() => orderDetails.value?.cost.withTax ?? 0)
  const itemCount = computed(() => orderDetails.value?.items?.length ?? 0)
  const packages = computed(() => orderDetails.value?.packages ?? [])
  const orderItems = computed(() => orderDetails.value?.items ?? [])
  const paymentKey = computed(() => orderDetails.value?.payment?.[0]?.key)

  const variantIds = computed(() => {
    return [...new Set(orderItems.value.map((item) => item.variant.id))]
  })

  const { data: orderVariants } = useVariant(
    {
      params: computed(() => ({ ids: variantIds.value })),
    },
    `variant-${key}`,
  )

  return {
    orderDetails,
    status,
    orderVariants,
    totalAmount,
    billingAddress,
    shippingAddress,
    deliveryCost,
    itemCount,
    packages,
    orderItems,
    paymentKey,
  }
}
