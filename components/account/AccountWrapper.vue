<template>
  <div>
    <AccountHeader :title="title" />
    <div class="container px-5 md:mt-6 md:px-4">
      <div class="flex flex-col md:flex-row md:pt-5">
        <div
          class="mt-6 w-full pb-10 md:mt-0 md:w-1/3 lg:w-1/4"
          :class="{ 'hidden md:block': route.params.id || isAccountPage }">
          <OrderOverviewHeader :orders-count="orders.length" />
          <div
            v-if="shouldDisplayOrderOverview"
            class="rounded-md border border-gray-350">
            <OrderHistoryItem
              v-for="(order, idx) in slicedOrders"
              :key="order.id"
              v-bind="order"
              :is-latest-order="!idx"
              :class="{ 'border-t border-t-gray-350': idx }" />
          </div>
          <div v-else class="bg-slate-100 p-10 text-center">
            <div class="p-5 text-sm font-bold text-primary">
              {{ $t('my_account.no_orders_found') }}
            </div>
            <div class="border-t border-t-gray-350 bg-secondary-450 p-5">
              <DefaultLink
                :to="routeList.home"
                class="!block w-full rounded bg-white px-4 py-2 text-center text-xs">
                {{ $t('error.continue_shopping') }}
              </DefaultLink>
            </div>
          </div>
          <div v-if="orders?.length" class="text-center">
            <SimplePagination
              v-if="orders.length > ORDERS_PER_PAGE"
              :current-page="currentPage"
              :per-page="ORDERS_PER_PAGE"
              :record-count="orders.length"
              @change:page="changePage" />
          </div>
        </div>
        <div class="w-full md:w-2/3 md:pl-28 lg:w-3/4">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrderSummary } from '@scayle/storefront-nuxt'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: '',
  },
  isAccountPage: {
    type: Boolean,
    default: false,
  },
})

const ORDERS_PER_PAGE = 8

const route = useRoute()

const { user } = await useUser()

const currentPage = ref<number>(1)

const { isGreaterOrEquals } = useViewport()

const orders = computed(() => user?.value?.orderSummary ?? [])
const currentOrderId = computed(() => {
  return +route.params.id || (orders.value.length && orders.value[0].id)
})

if (currentOrderId.value) {
  const index =
    (orders.value?.findIndex(
      (order: OrderSummary) => order.id === currentOrderId.value,
    ) ?? -2) + 1
  if (index > -1) {
    currentPage.value = Math.max(Math.ceil(index / ORDERS_PER_PAGE), 1) // pagination to always start at 1
  }
}

const slicedOrders = ref<OrderSummary[] | undefined>()

const updateSlicedOrders = () => {
  slicedOrders.value = orders.value?.slice(
    (currentPage.value - 1) * ORDERS_PER_PAGE,
    (currentPage.value - 1) * ORDERS_PER_PAGE + ORDERS_PER_PAGE,
  )
}
const changePage = (page: number): void => {
  currentPage.value = page
  updateSlicedOrders()
}

const shouldDisplayOrderOverview = computed(
  () => Boolean(orders?.value?.length) && Boolean(slicedOrders?.value?.length),
)

// in case the orders are not yet fetchen when mounting, we need to later
// set these values. Use Case: client-side navigation to the page
watch(orders, () => updateSlicedOrders())

// when mounted determines the first order that should be shown - if possible
// this can only happen when order data is loaded before mounting.
// usually this means: being rendered on the server

onMounted(async () => {
  if (
    !route.params?.id &&
    !props.isAccountPage &&
    currentOrderId.value &&
    isGreaterOrEquals('md') // On mobile the user should first see the order list
  ) {
    await localizedNavigateTo(getOrderDetailsRoute(currentOrderId.value))
  }
  updateSlicedOrders()
})
</script>
