<template>
  <PageContent>
    <div v-if="fetching" class="container flex gap-2">
      <ProductCardSkeleton v-for="index in 2" :key="`osp-loading-${index}`" />
    </div>
    <div
      v-else-if="orderData"
      class="px-6 sm:mx-auto sm:flex sm:flex-wrap md:px-0"
    >
      <OspBasicDataSection v-bind="{ orderData, deliveryDate }" />
      <OspSummarySection v-bind="{ orderData, deliveryDate }" />
    </div>
    <div v-else>
      <EmptyState :title="$t('osp.no_order_found')" show-default-actions />
    </div>
  </PageContent>
</template>

<script setup lang="ts">
const route = useRoute()
const cbdToken = String(route.query.cbd)
const { data: orderData, fetching } = await useOrderConfirmation<
  OrderProduct,
  OrderVariant
>({
  params: { cbdToken },
  options: { lazy: true },
  key: `orderConfirmation-${cbdToken}`,
})

const user = await useUser()

const { trackPurchaseEvent } = useTrackingEvents()

watch(
  fetching,
  (isFetching) => {
    if (!isFetching && orderData.value) {
      trackPurchaseEvent(orderData.value)
    }
  },
  { immediate: true },
)

watch(
  user.fetching,
  async (isFetching) => {
    if (!isFetching && user.isLoggedIn) {
      // This will force fetching fresh user data from the backend.
      // Without it the new order will not be available in the users order list,
      // which will cause the oder not being displayed in the MyAccount area.
      await user.forceRefresh()
    }
  },
  { immediate: true },
)

const deliveryDate = computed(() => {
  const [pkg] = orderData.value.packages || []
  return pkg?.deliveryDate
})

defineOptions({ name: 'OrderSuccessPage' })
definePageMeta({ pageType: 'osp' })
</script>
