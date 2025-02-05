<template>
  <div>
    <SFAccountHeader :title="title" />
    <SFPageContainer>
      <div class="flex flex-col md:flex-row">
        <aside
          v-if="!isAccountPage"
          class="mt-6 w-full pb-10 md:mt-0 md:w-1/3 lg:w-1/4"
          :class="{ 'hidden md:block': route.params.id }"
        >
          <SFAsyncDataWrapper :status="status">
            <SFOrderOverviewHeader :orders-count="orders.length" />
            <div v-if="shouldDisplayOrderOverview">
              <SFOrderHistoryItem
                v-for="(order, idx) in slicedOrders"
                :key="order.id"
                v-bind="order"
                :is-latest-order="!idx"
                class="border border-gray-350 first-of-type:rounded-t-md last-of-type:rounded-b-md hover:border hover:border-primary"
              />
            </div>
            <div v-else class="bg-slate-100 p-10 text-center">
              <div
                class="p-5 text-sm font-bold text-primary"
                data-testid="headline-no-orders"
              >
                {{ $t('my_account.no_orders_found') }}
              </div>
              <div class="border-t border-t-gray-350 bg-secondary-450 p-5">
                <SFLocalizedLink
                  :to="routeList.home"
                  class="!block w-full rounded bg-white px-4 py-2 text-center text-xs"
                  data-testid="button-continue-shopping"
                >
                  {{ $t('error.continue_shopping') }}
                </SFLocalizedLink>
              </div>
            </div>
            <div v-if="orders?.length" class="text-center">
              <SFSimplePagination
                v-if="orders.length > ORDERS_PER_PAGE"
                :current-page="currentPage"
                :per-page="ORDERS_PER_PAGE"
                :record-count="orders.length"
                @change:page="changePage"
              />
            </div>

            <template #loading>
              <SFOrderListSkeletonLoader :orders-per-page="ORDERS_PER_PAGE" />
            </template>
          </SFAsyncDataWrapper>
        </aside>
        <div class="w-full md:w-2/3 md:pl-14 lg:w-3/4 lg:pl-28">
          <slot />
        </div>
      </div>
    </SFPageContainer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { OrderSummary } from '@scayle/storefront-nuxt'
import SFAsyncDataWrapper from '../SFAsyncDataWrapper.vue'
import SFOrderOverviewHeader from '../order/SFOrderOverviewHeader.vue'
import SFOrderHistoryItem from '../order/SFOrderHistoryItem.vue'
import SFLocalizedLink from '../SFLocalizedLink.vue'
import SFAccountHeader from './SFAccountHeader.vue'
import SFOrderListSkeletonLoader from './SFOrderListSkeletonLoader.vue'
import { useRouteHelpers } from '~/composables'
import { useDefaultBreakpoints } from '#storefront-ui/composables'
import { SFSimplePagination, SFPageContainer } from '#storefront-ui/components'
import { useUser } from '#storefront/composables'
import { useRoute } from '#app/composables/router'
import { routeList } from '~/utils/route'

const { title, isAccountPage = false } = defineProps<{
  title: string
  isAccountPage?: boolean
}>()

const ORDERS_PER_PAGE = 8

const route = useRoute()

const { user, status } = useUser()

const currentPage = ref<number>(1)

const { isGreaterOrEqual } = useDefaultBreakpoints()
const { getOrderDetailsRoute, localizedNavigateTo } = useRouteHelpers()

const orders = computed(() => user?.value?.orderSummary ?? [])
const currentOrderId = computed(() => {
  return +route.params.id || (orders.value.length && orders.value[0].id)
})

const slicedOrders = computed(() => {
  return orders.value?.slice(
    (currentPage.value - 1) * ORDERS_PER_PAGE,
    (currentPage.value - 1) * ORDERS_PER_PAGE + ORDERS_PER_PAGE,
  )
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

const changePage = (page: number): void => {
  currentPage.value = page
}

const shouldDisplayOrderOverview = computed(() => {
  return !!orders?.value?.length && !!slicedOrders?.value?.length
})

// when mounted determines the first order that should be shown - if possible
// this can only happen when order data is loaded before mounting.
// usually this means: being rendered on the server
onMounted(async () => {
  if (
    !route.params?.id &&
    !isAccountPage &&
    currentOrderId.value &&
    isGreaterOrEqual('md') // On mobile the user should first see the order list
  ) {
    await localizedNavigateTo(getOrderDetailsRoute(currentOrderId.value))
  }
})
</script>
