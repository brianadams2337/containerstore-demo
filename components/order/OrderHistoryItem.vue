<template>
  <div
    class="cursor-pointer bg-white p-5 transition-all ease-in-out"
    :class="{ '!border-primary': id === paramId }"
  >
    <SFLink
      raw
      :to="getOrderDetailsRoute(id)"
      class="flex flex-col items-baseline"
      data-testid="order-history-list-item"
    >
      <div class="mb-2 text-sm font-bold" data-testid="order-list-item-title">
        {{
          $t('my_account.orders.order_summary_header', {
            date: formatLocaleDate(confirmedAt),
          })
        }}
      </div>
      <div
        class="text-xs font-semibold text-secondary"
        data-testid="order-list-item-data"
      >
        <span>{{ shopId }} - {{ id }}</span>
        <span>{{ ' · ' }}</span>
        <span v-if="itemCount">
          {{ $t('my_account.orders.item_count', { count: itemCount }) }}
        </span>
      </div>
      <div :class="isLatestOrder ? 'xs:block sm:hidden' : 'hidden'">
        <SFProgressBar
          :progress="progressLevel"
          :type="progressType"
          class="my-2"
          rounded
        />
        <p class="mb-5 text-xs">
          Status:
          <span class="font-bold">{{ status?.split('_').join(' ') }}</span>
        </p>
      </div>
    </SFLink>
    <SFLink
      :to="getOrderDetailsRoute(id)"
      class="w-full justify-center rounded bg-primary px-5 py-3 text-xs font-semibold text-white md:w-auto md:px-8"
      :class="isLatestOrder ? 'xs:flex sm:hidden' : 'hidden'"
      is-full-width
    >
      {{ $t('my_account.orders.details') }}
    </SFLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { OrderSummary } from '@scayle/storefront-nuxt'
import { DeliveryProgress, OrderStatus } from '~/constants/order'
import { useFormatDate, useRouteHelpers } from '~/composables'
import { useRoute } from '#app/composables/router'

type Props = {
  id: OrderSummary['id']
  shopId: OrderSummary['shopId']
  itemCount?: OrderSummary['itemCount']
  confirmedAt?: OrderSummary['confirmedAt']
  status?: OrderSummary['status']
  isLatestOrder?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  itemCount: undefined,
  confirmedAt: undefined,
  status: undefined,
  isLatestOrder: false,
})

const route = useRoute()

const { formatLocaleDate } = useFormatDate()

const paramId = computed(() => +route.params.id)
const { getOrderDetailsRoute } = useRouteHelpers()

const progressLevel = computed<number>(() => {
  // @ts-expect-error Type 'undefined' cannot be used as an index type.
  return DeliveryProgress[props.status] || DeliveryProgress.DEFAULT
})

const progressType = computed<'success' | 'warn' | 'danger'>(() => {
  return props.status !== OrderStatus.CANCELLATION_COMPLETED
    ? 'success'
    : 'danger'
})
</script>
