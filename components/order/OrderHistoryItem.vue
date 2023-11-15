<template>
  <div
    class="cursor-pointer border border-transparent bg-white p-5 transition-all ease-in-out hover:rounded-md hover:border hover:border-primary"
    :class="{
      'rounded-md !border-primary': id === paramId,
    }">
    <DefaultLink
      raw
      :to="getOrderDetailsRoute(id)"
      class="flex flex-col items-baseline">
      <div class="mb-2 text-sm font-bold">
        {{
          $t('my_account.orders.order_summary_header', {
            date: localeFormattedDate(confirmedAt),
          })
        }}
      </div>
      <div class="text-xs font-semibold text-secondary">
        <span>{{ shopId }} - {{ id }}</span>
        <span>{{ ' · ' }}</span>
        <span v-if="itemCount">
          {{ $t('my_account.orders.item_count', { count: itemCount }) }}
        </span>
      </div>
      <div :class="isLatestOrder ? 'xs:block sm:hidden' : 'hidden'">
        <ProgressBar
          :progress="progressLevel"
          :type="progressType"
          class="my-2"
          rounded />
        <p class="mb-5 text-xs">
          Status:
          <span class="font-bold">{{ status?.split('_').join(' ') }}</span>
        </p>
        <DefaultLink
          :to="getOrderDetailsRoute(id)"
          class="w-full justify-center rounded bg-primary px-5 py-3 text-xs font-semibold text-white md:w-auto md:px-8"
          is-full-width>
          {{ $t('my_account.orders.details') }}
        </DefaultLink>
      </div>
    </DefaultLink>
  </div>
</template>

<script setup lang="ts">
import type { OrderSummary } from '@scayle/storefront-nuxt'

const props = defineProps({
  id: {
    type: Number as PropType<OrderSummary['id']>,
    required: true,
  },
  shopId: {
    type: Number as PropType<OrderSummary['shopId']>,
    required: true,
  },
  itemCount: {
    type: Number as PropType<OrderSummary['itemCount']>,
    default: undefined,
  },
  confirmedAt: {
    type: String as PropType<OrderSummary['confirmedAt']>,
    default: undefined,
  },
  status: {
    type: String as PropType<OrderSummary['status']>,
    default: undefined,
  },
  isLatestOrder: {
    type: Boolean,
    default: false,
  },
})

const route = useRoute()
const paramId = computed(() => +route.params.id)

const progressLevel = computed<number>(() => {
  // @ts-ignore
  return DeliveryProgress[props.status] || 5
})

const progressType = computed<'success' | 'warn' | 'danger'>(() => {
  return props.status !== Status.CANCELLATION_COMPLETED ? 'success' : 'danger'
})
</script>
