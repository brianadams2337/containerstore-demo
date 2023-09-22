<template>
  <div>
    <div v-if="fetching" class="container flex gap-2">
      <ProductCardSkeleton v-for="index in 2" :key="`osp-loading-${index}`" />
    </div>
    <div v-else-if="orderData" class="sm:mx-auto sm:flex">
      <div class="container sm:mx-16 sm:pr-20">
        <div class="mt-16 space-y-2">
          <Headline size="lg" type="loud" class="block">
            <div class="flex items-center sm:text-lg">
              <IconCheckmark class="relative top-[-2px] mr-2 h-5 w-5" />
              {{ $t('osp.intro') }}
              {{ orderData.customer?.firstName }}
            </div>
          </Headline>
        </div>
        <div class="max-w-xl text-sm sm:grid">
          <div class="text-sm">
            {{ $t('osp.email_send') }}
          </div>
          <div class="mt-10 grid w-full grid-cols-2 gap-y-8 sm:grid-cols-3">
            <OspBasicOrderData v-bind="orderData" />
            <OspAddressInformation :address="orderData.address" />
            <div v-if="orderData.payment?.[0].key">
              <Headline size="sm" tag="h2" type="loud" class="mb-3">
                {{ $t('osp.payment') }}
              </Headline>
              <PaymentIcon :paid-with="orderData.payment[0].key" />
            </div>
          </div>
          <OspDeliveryDate
            v-if="orderData.packages && viewport.isLessThan('sm')"
            :delivery-date="orderData.packages[0].deliveryDate" />
          <div class="my-8 flex space-x-4 sm:mt-12">
            <AppButton type="tertiary" :to="{ name: routeList.home.name }">
              {{ $t('basket.continue_shopping_label') }}
            </AppButton>
            <AppButton
              v-if="orderData.id"
              type="primary"
              :to="getOrderDetailsRoute(orderData.id)">
              {{ $t('osp.order_details') }}
            </AppButton>
          </div>
        </div>
      </div>
      <div class="w-3/4 max-sm:container sm:bg-gray-100">
        <div class="container py-4 text-sm sm:p-10 md:px-20">
          <div class="divide-y divide-gray-500">
            <OspDeliveryDate
              v-if="orderData.packages"
              :delivery-date="orderData.packages[0].deliveryDate" />
            <div class="space-y-2">
              <Headline
                size="sm"
                tag="h2"
                type="loud"
                class="mb-3 mt-8 block sm:hidden">
                {{ $t('osp.order_overview') }}
              </Headline>

              <ul v-if="orderItems">
                <li
                  v-for="({ variant, product, price }, idx) in orderItems"
                  :key="idx">
                  <OspProductCard
                    v-if="product.advancedAttributes"
                    v-bind="{ variant, product, price }"
                    :quantity="getItemQuantity(variant.id)" />
                </li>
              </ul>
            </div>
            <OspPaymentSummary :cost="orderData.cost" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { OrderProduct, OrderVariant } from '~/types/osp'

const viewport = useViewport()

const route = useRoute()
const cbdToken = String(route.query.cbd)

const { data: orderData, fetching } = await useOrderConfirmation<
  OrderProduct,
  OrderVariant
>({
  params: { cbdToken },
  key: `orderConfirmation-${cbdToken}`,
})
const user = await useUser()

// const { trackPurchaseEvent } = useTrackingEvents()
// onMounted(() => {
// trackPurchaseEvent(orderData.value)
// })

watch(user.fetching, async (isFetching) => {
  if (!isFetching && user.isLoggedIn) {
    // This will force fetching fresh user data from the backend.
    // Without it the new order will not be available in the users order list,
    // which will cause the oder not being displayed in the MyAccount area.
    await user.forceRefresh()
  }
})

const getItemQuantity = (variantId: number): number | undefined => {
  const isVariant = (value: any) => value.variant.id === variantId
  return orderData.value?.items?.filter(isVariant).length
}

const orderItems = computed(() => {
  return useUnique(orderData.value?.items || [], (it: any) => it.variant.id)
})
</script>

<script lang="ts">
export default {
  name: 'OrderSuccessPage',
  meta: {
    pageType: 'osp',
  },
}
</script>
