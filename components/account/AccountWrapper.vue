<template>
  <div>
    <AccountHeader :title="title" />
    <PageContent>
      <div class="flex flex-col md:flex-row">
        <div
          class="mt-6 w-full pb-10 md:mt-0 md:w-1/3 lg:w-1/4"
          :class="{ 'hidden md:block': route.params.id || isAccountPage }"
        >
          <OrderOverviewHeader :orders-count="orders.length" />
          <div v-if="shouldDisplayOrderOverview">
            <OrderHistoryItem
              v-for="(order, idx) in slicedOrders"
              :key="order.id"
              v-bind="order"
              :is-latest-order="!idx"
              class="border border-gray-350 first-of-type:rounded-t-md last-of-type:rounded-b-md hover:border hover:border-primary"
            />
          </div>
          <div v-else class="bg-slate-100 p-10 text-center">
            <div class="p-5 text-sm font-bold text-primary">
              {{ $t('my_account.no_orders_found') }}
            </div>
            <div class="border-t border-t-gray-350 bg-secondary-450 p-5">
              <SFLink
                :to="routeList.home"
                class="!block w-full rounded bg-white px-4 py-2 text-center text-xs"
              >
                {{ $t('error.continue_shopping') }}
              </SFLink>
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
        </div>
        <div class="w-full md:w-2/3 md:pl-14 lg:w-3/4 lg:pl-28">
          <slot />
        </div>
      </div>
    </PageContent>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { OrderSummary } from '@scayle/storefront-nuxt'
import { BasketListingMetadata } from '~/constants/listingMetadata'
import {
  useDefaultBreakpoints,
  useRouteHelpers,
  useTrackingEvents,
  wishlistListingMetadata,
} from '~/composables'
import { useBasket, useUser, useWishlist } from '#storefront/composables'
import { useRoute } from '#app/composables/router'
import { routeList } from '~/utils/route'

type Props = {
  title: string
  icon?: string
  isAccountPage?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  icon: '',
  isAccountPage: false,
})

const ORDERS_PER_PAGE = 8

const route = useRoute()
const wishlist = await useWishlist()
const basket = await useBasket()
const {
  trackWishlist,
  collectProductListItems,
  trackBasket,
  collectBasketItems,
} = useTrackingEvents()

const { user } = await useUser()

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
  trackWishlist(
    collectProductListItems(wishlist.products.value, {
      listId: wishlistListingMetadata.id,
      listName: wishlistListingMetadata.name,
    }),
  )
  trackBasket(
    collectBasketItems(basket.data.value?.items, {
      listId: BasketListingMetadata.ID,
      listName: BasketListingMetadata.NAME,
    }),
  )

  if (
    !route.params?.id &&
    !props.isAccountPage &&
    currentOrderId.value &&
    isGreaterOrEqual('md') // On mobile the user should first see the order list
  ) {
    await localizedNavigateTo(getOrderDetailsRoute(currentOrderId.value))
  }
})
</script>
