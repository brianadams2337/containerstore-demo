import { computed, type Ref } from 'vue'
import { useOrder, useVariant } from '#storefront/composables'
import { useRoute } from '#app/composables/router'
import type { Order, OrderItems } from '~/types/order'

export function useOrderDetails(key?: string) {
  if (!key) {
    // The key is auto-added so this will only be thrown if a nullish value is passed to the function
    throw Error('missing key argument')
  }
  const route = useRoute()
  const paramId = computed(() => +route.params.id)

  const { data, fetching } = useOrder({
    params: computed(() => ({ orderId: paramId.value })),
    key: `orderId-${key}`,
  })

  // NOTE: Explicitly casting returned data from useOrder to mitigate returned any data type
  const orderDetails = data as Ref<Order>

  const totalAmount = computed(() => orderDetails.value?.cost.withTax ?? 0)

  const deliveryCost = computed(() => {
    return (
      (orderDetails as Ref<Order>).value?.cost.appliedFees
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
  const orderItems = computed(() => orderDetails.value.items as OrderItems)
  const paymentKey = computed(() => {
    return orderDetails.value.payment && orderDetails.value.payment[0].key
  })

  const variantIds = computed(() => {
    const ids =
      orderDetails.value?.items?.map((it) => it.variant.id as number) ?? []

    return [...new Map(ids.map((id) => [id, id])).values()]
  })

  const { data: orderVariants } = useVariant({
    params: computed(() => ({ ids: variantIds.value })),
    key: `variant-${key}`,
  })

  return {
    orderDetails,
    fetching,
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
