import { unique } from 'radash'

export async function useOrders(key?: string) {
  if (!key) {
    // The key is auto-added so this will only be thrown if a nullish value is passed to the function
    throw Error('missing key argument')
  }
  const app = useNuxtApp()
  const route = useRoute()
  const paramId = computed(() => +route.params.id)

  const { data: orderDetails, fetching } = await useOrder({
    params: computed(() => ({ orderId: paramId.value })),
    key: `orderId-${key}`,
  })

  const variantIds = computed(() => {
    const ids =
      orderDetails.value?.items?.map((it) => it.variant.id as number) ?? []
    return unique(ids)
  })

  const { data: orderVariants } = await app.runWithContext(() =>
    useVariant({
      params: computed(() => ({ ids: variantIds.value })),
      key: `variant-${key}`,
    }),
  )

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
  const orderItems = computed(() => orderDetails.value.items as OrderItems)
  const paymentKey = computed(() => {
    return orderDetails.value.payment && orderDetails.value.payment[0].key
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
